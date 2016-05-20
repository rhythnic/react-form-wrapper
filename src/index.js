import React, {Component, PropTypes, createElement} from 'react';
import Immutable, { Map, List } from 'immutable';
import assign from 'lodash/assign';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { methodsForWrappedComponent } from './class-methods';
import { update as updateForm, buildPath } from './pure-functions';

export const update = updateForm;

export default ({ schema, delimiter = '.', disableSubmit } = {}) => WrappedComponent => {

  class FormWrapper extends Component {
    constructor(props) {
      super(props);

      for (let method in methodsForWrappedComponent) {
        this[method] = methodsForWrappedComponent[method].bind(this);
      }

      this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
      this._delimiter = delimiter;
      this._disableSubmit = disableSubmit;
      this._schema = schema;
      this._fields = {};
      this.state = this.initialState(props);
    }

    componentDidMount() {
      this._isMounted = true;
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    componentWillReceiveProps(np) {
      if (this._isMounted && np.value !== this.props.value) {
        this.setState(this.initialState(np));
      }
    }

    initialState({ value, onChange }) {
      let state = { submitIsDisabled: !!this._disableSubmit && this._disableSubmit(value) };
      if (!onChange) {
        value = value || {};
        const { version } = (this.state || {});
        if (value && typeof value === 'object') {
          state = assign(state, {
            value: Immutable.fromJS(value),
            version: version == null ? 0 : (version + 1)
          });
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
        value:    this.getValue( {toJS: false} ),
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
