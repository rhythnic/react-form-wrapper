import React, {Component, PropTypes, createElement} from 'react';
import Immutable, { Map, List } from 'immutable';
import assign from 'lodash/assign';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { methodsForWrappedComponent } from './class-methods';
import { update as updateForm, buildPath } from './pure-functions';

export const update = updateForm;

export default ({ schema, delimiter = '.', validation, disableSubmit } = {}) => WrappedComponent => {

  class FormWrapper extends Component {
    constructor(props) {
      super(props);

      for (let method in methodsForWrappedComponent) {
        this[method] = methodsForWrappedComponent[method].bind(this);
      }

      let errorState, valueState;

      if (validation) {
        if (!Array.isArray(validation) || !validation.every(item => typeof item === 'object')) {
          throw new Error("Validation must be an array of objects");
        }
        this._validation = validation;
        errorState = { error: new Map() };
      }

      this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
      this._delimiter = delimiter;
      this._schema = schema;
      this._disableSubmit = disableSubmit;
      this._fields = {};

      if (!props.onChange) {
        valueState = this.valueState(props);
      }

      if (errorState || valueState) {
        this.state = assign(errorState || {}, valueState);
      }
    }

    componentDidMount() {
      this._isMounted = true;
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    componentWillReceiveProps(np) {
      if (this._isMounted && np.value !== this.props.value) {
        return this.setState(this.valueState(np));
      }
    }

    valueState({ value, onChange }) {
      let state = { submitIsDisabled: !!this._disableSubmit && this._disableSubmit(value) };
      if (!onChange) {
        value = value || {};
        const version = (this.state || {}).version || 0;
        if (value && typeof value === 'object') {
          return {
            value: Immutable.fromJS(value),
            version: version + 1
          };
        } else {
          throw new Error("Attempting to set parent form wrapper value to non-object");
        }
      }
      return state;
    }

    getValue({ toJS = true } = {}) {
      const value = (this.state && this.state.value) || this.props.value;
      return value && toJS && (Map.isMap(value) || List.isList(value))
        ? value.toJS()
        : value;
    }

    getProps() {
      return assign({}, this.props, {
        onSubmit: this.submitHandler,
        onChange: this.changeHandler,
        onReset:  this.resetHandler,
        getName:  this.getName,
        getValue: this.getInValue,
        getField: this.getField,
        field:    this.getField,
        value:    this.getValue({ toJS: false }),
        submitIsDisabled: this.state.submitIsDisabled
      });
    }

    render() {
      return createElement(WrappedComponent, this.getProps());
    }
  }

  FormWrapper.propTypes = {
    onSubmit: PropTypes.func,
    onReset: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    name:  PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  }

  FormWrapper.defaultProps = {
    onSubmit: null,
    onReset: null,
    onChange: null,
    value: null,
    name: ''
  }

  return FormWrapper;
}
