import React, {Component, PropTypes, createElement} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable, {List, Map} from 'immutable';

function update (state, name, value, active) {
  return state.updateIn(name, (oldVal) => {
    if (typeof active !== 'boolean') {
      return value;
    } else if (typeof oldVal === 'boolean') {
      return active;
    } else if (List.isList(oldVal)){
      return active ? oldVal.push(value) : oldVal.delete(oldVal.indexOf(value));
    }
    return oldVal;
  })
}

function getEventProperties(evt) {
  let {type, name, value, checked} = evt.target;
  switch(type) {
    case 'checkbox':
      return [name, value, checked]
    case 'select-multiple':
      value = [].map.call(evt.target.querySelectorAll('option:checked'), o => o.value);
      return [name, new List(value)];
    default:
      return [name, value]
  }
}

function changeHandler(evt) {
  const {onChange, delimeter} = this.props;
  if (!this._isMounted) { return false; }
  let [name, value, active] = (typeof evt === 'object' && !Array.isArray(evt))
    ? getEventProperties(evt)
    : Array.prototype.slice.call(arguments, 0, 3);
  name = this.prependName(name);
  if (onChange && typeof onChange === 'function') {
    return onChange(name, value, active);
  }
  this.setState({value: update(this.state.value, name, value, active)});
}

function submitHandler(evt) {
  evt.preventDefault();
  const {onSubmit} = this.props;
  const {state} = this;
  if (onSubmit && typeof onSubmit === 'function') {
    onSubmit(state && state.value ? state.value.toJS() : evt);
  }
}

function resetHandler(evt) {
  evt.preventDefault();
  if (this._isMounted) {
    const {onReset} = this.props;
    if (onReset && typeof onReset === 'function') {
      return onReset(evt);
    }
    this.setState({value: Immutable.fromJS(this.props.value)})
  }
}

function getValue(name, {toJS}) {
  name = this.split(name);
  let value = (this.state && this.state.value) || this.props.value;
  if (value) {
    value = value.getIn(name);
    return toJS && (Map.isMap(value) || List.isList(value))
      ? value.toJS()
      : value;
  }
}

function getField(name, opts = {}) {
  const base = {
    name: Array.isArray(name) ? name.join(this.props.delimeter) : name,
    value: this.getValue(name, opts),
    onChange: this.changeHandler
  };
  if (typeof base.value === 'boolean') {
    base.checked = base.value;
  }
  return base;
}

export default schema => WrappedComponent => {

  class Form extends Component {
    constructor(props) {
      super(props);
      this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
      if (!props.onChange) {
        this.state = {value: Immutable.fromJS(props.value)};
      }
      this.changeHandler = changeHandler.bind(this);
      this.submitHandler = submitHandler.bind(this);
      this.resetHandler = resetHandler.bind(this);
      this.getValue = getValue.bind(this);
      this.getField = getField.bind(this);
      this.schema = schema;
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
    split(word) {
      return Array.isArray(word) ? word : word.split(this.props.delimeter);
    }
    prependName(name) {
      name = this.split(name);
      return !this.props.name ? name : [...this.split(this.props.name), ...name];
    }
    getProps(state) {
      return Object.assign({}, this.props, {
        onSubmit: this.submitHandler,
        onChange: this.changeHandler,
        onReset: this.resetHandler,
        getField: this.getField,
        getValue: this.getValue,
        value: (state && state.value) || this.props.value } );
    }
    render() {
      return <WrappedComponent {...this.getProps(this.state)} />
    }
  }

  Form.propTypes = {
    onSubmit: PropTypes.func,
    onReset: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.object,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    delimeter: PropTypes.string
  }

  Form.defaultProps = {
    value: {},
    name: null,
    delimeter: '.'
  }

  return Form;

}
