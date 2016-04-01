import React, {Component, PropTypes, createElement} from 'react';
import Immutable from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { methodsForWrappedComponent } from './class-methods';

export default ({ schema, delimiter = '.' } = {}) => WrappedComponent => {

  class Form extends Component {
    constructor(props) {
      super(props);

      for (let method in methodsForWrappedComponent) {
        this[method] = methodsForWrappedComponent[method].bind(this);
      }

      this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
      this._delimiter = delimiter;
      this._schema = schema;
      this._paths = {};
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

    getValue({ toJS = true } = {}) {
      const value = (this.state && this.state.value) || this.props.value;
      return value && (toJS ? value.toJS() : value);
    }

    getProps() {
      return Object.assign({}, this.props, {
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

  Form.propTypes = {
    onSubmit: PropTypes.func,
    onReset: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.object,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  }

  Form.defaultProps = {
    value: {},
    name: null
  }

  return Form;
}
