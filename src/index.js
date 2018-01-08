import React, {Component, createElement} from 'react';
import PropTypes from 'prop-types';
import Immutable, { Map, List } from 'immutable';
import assign from 'lodash/assign';
import get from 'lodash/fp/get';
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
      value = value || {};
      let state = { submitIsDisabled: !!this._disableSubmit &&
        this._disableSubmit(Map.isMap(value) ? value : Immutable.fromJS(value)) };
      if (onChange) { return state; }
      const version = get('version')(this.state);
      if (typeof value !== 'object') {
        throw new Error("Attempting to set parent form wrapper value to non-object");
      }
      return assign(state, {
        value: Immutable.fromJS(value),
        version: version == null ? 0 : (version + 1)
      });
    }

    getValue({ toJS = true } = {}) {
      const value = this.state.value || this.props.value;
      return value && toJS && typeof value.toJS === 'function'
        ? value.toJS()
        : value;
    }

    getProps() {
      return assign({}, this.props, {
        onSubmit:   this.submitHandler,
        onChange:   this.changeHandler,
        onReset:    this.resetHandler,
        field:      this.getField,
        getName:    this.getName,
        getField:   this.getField,
        getValue:   this.getInValue,
        value:      this.getValue( {toJS: false} ),
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
