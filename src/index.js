import React, {Component, PropTypes, createElement} from 'react';
import Immutable from 'immutable';
import assign from 'lodash/assign';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { methodsForWrappedComponent } from './class-methods';
import { update as updateForm, buildPath } from './pure-functions';

export const update = updateForm;

export default ({ schema, delimiter = '.' } = {}) => WrappedComponent => {

  class FormWrapper extends Component {
    constructor(props) {
      super(props);

      for (let method in methodsForWrappedComponent) {
        this[method] = methodsForWrappedComponent[method].bind(this);
      }

      this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
      this._delimiter = delimiter;
      this._schema = schema;
      this._fieldsByChildName = {};
      this._fieldsByFullName = {};
      if (!props.onChange) {
        this.state = this.initialState(props);
      }
    }

    componentDidMount() {
      this._isMounted = true;
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    componentWillReceiveProps(np) {
      if (this._isMounted && !np.onChange && np.value !== this.props.value) {
        this.setState(this.initialState(np));
      }
    }

    initialState({ value }) {
      value = value || {};
      const { version } = (this.state || {});
      if (value && typeof value === 'object') {
        return {
          value: Immutable.fromJS(value),
          version: version == null ? 0 : (version + 1)
        };
      } else {
        throw new Error("Attempting to set parent form wrapper value to non-object");
      }
    }

    getValue({ toJS = true } = {}) {
      const value = (this.state && this.state.value) || this.props.value;
      return value && (toJS ? value.toJS() : value);
    }

    getNextKey() {
      return this._nextKey++;
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
        value:    this.getValue( {toJS: false} )
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
