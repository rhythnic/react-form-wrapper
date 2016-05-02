import React, {Component, PropTypes, createElement} from 'react';
import Immutable from 'immutable';
import { assign, isObject } from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { methodsForWrappedComponent, isArrayField } from './class-methods';
import { update as updateForm } from './pure-functions';

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
      this._paths = {};
      this._fields = {};
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

    initialState({ value = {} }) {
      if (value && isObject(value)) {
        return { value: Immutable.fromJS(value) };
      } else {
        throw new Error("Attempting to set parent form wrapper value to non-object");
      }
    }

    getValue({ toJS = true } = {}) {
      const value = (this.state && this.state.value) || this.props.value;
      return value && (toJS ? value.toJS() : value);
    }

    getProps() {
      return assign({}, this.props, {
        onSubmit: this.submitHandler,
        onChange: this.changeHandler,
        onReset:  this.resetHandler,
        getName:  this.getName,
        getField: this.getField,
        getValue: this.getInValue,
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
    value: PropTypes.object,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  }

  return FormWrapper;
}
