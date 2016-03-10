// ***************************************************************
// These class methods brought out of the class definition
// because they are passed to the wrapped component, and so
// need to be bound to the class instance.
// ***************************************************************

import Immutable, {List, Map} from 'immutable';
import { update, getEventProperties,
  normalizeChangeHandlerArgs } from './pure-functions'

export function getField(childName, opts = {}) {
  const base = {
    name: this.getName(childName),
    value: this.getInValue(childName, opts),
    onChange: this.changeHandler
  };
  if (typeof base.value === 'boolean') {
    base.checked = base.value;
  }
  return base;
}

export function getName(childName) {
  const {name, delimiter} = this.props;
  return name ? `${name}${delimiter}${childName}` : childName;
}

export function changeHandler(evt, ...more) {
  const {onChange, delimiter} = this.props;
  if (onChange && typeof onChange === 'function') {
    return onChange(evt, ...more)
  }
  if (!this._isMounted) { return false; }
  this.setState({value: update(this.state.value, evt, delimiter)});
}

export function submitHandler(evt) {
  evt.preventDefault();
  const {onSubmit, onChange} = this.props;
  if (onSubmit && typeof onSubmit === 'function') {
    onSubmit(onChange ? evt : this.getValue({toJS: true}));
  }
}

export function resetHandler(evt) {
  evt.preventDefault();
  if (!this._isMounted) { return false; }
  const {onReset} = this.props;
  if (onReset && typeof onReset === 'function') {
    return onReset(evt);
  }
  console.log('setting state to ', this.props.value);
  this.setState({value: Immutable.fromJS(this.props.value)})
}

export function getInValue(name, opts = {}) {
  let value = (this.state && this.state.value) || this.props.value;
  if (value) {
    value = value.getIn(name.split(this.props.delimiter));
    return opts.toJS && (Map.isMap(value) || List.isList(value))
      ? value.toJS()
      : value;
  }
}
