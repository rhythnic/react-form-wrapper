import React, {Component, PropTypes, createElement} from 'react';
import Immutable from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as classMethods from './class-methods';

export default schema => WrappedComponent => {

  class Form extends Component {
    constructor(props) {
      super(props);

      for (let method in classMethods) {
        this[method] = classMethods[method].bind(this);
      }

      //this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
      this.schema = schema;
      this.state = this.initialState(props);
    }

    componentDidMount() {
      this._isMounted = true;
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    componentWillReceiveProps(np) {
      if (this._isMounted && !np.onChange && np.value !== this.props.value) {
        this.setState({value: Immutable.fromJS(np.value)});
      }
    }

    initialState(props) {
      return props.onChange ? {} : {value: Immutable.fromJS(props.value)}
    }

    getValue(opts = {}) {
      const value = (this.state && this.state.value) || this.props.value;
      return value && (opts.toJS ? value.toJS() : value);
    }

    getProps() {
      return Object.assign({}, this.props, {
        onSubmit: this.submitHandler,
        onChange: this.changeHandler,
        onReset: this.resetHandler,
        getField: this.getField,
        getValue: this.getInValue,
        value: this.getValue() });
    }

    render() {
      return createElement(WrappedComponent, this.getProps());
    }
  }

  Form.propTypes = {
    onSubmit: PropTypes.func,
    onReset: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.object,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    delimiter: PropTypes.string
  }

  Form.defaultProps = {
    value: {},
    name: null,
    delimiter: '.'
  }

  return Form;
}
