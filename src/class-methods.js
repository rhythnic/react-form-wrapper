// ***************************************************************
// These class methods brought out of the class definition
// because they are passed to the wrapped component, and so
// need to be bound to the class instance.
// ***************************************************************


import Immutable from 'immutable';
import { update, buildPatchFromEvent } from './pure-functions';
import Field from './field';


export function getField(name, props, opts) {
  let field = this._fields[name];
  if (!field) {
    field = new Field(name, this);
    this._fields[field.name] = field;
  }
  return props || opts
    ? field.withProps(props, opts)
    : field;
}

export function normalizePatchOrEvent(patch) {
  // check if patch is an input event
  let field;
  if (!patch.op) {
    // normalize event to patch object
    field = this.getField(patch.target.name);
    patch = buildPatchFromEvent(patch, field);
  } else if (typeof patch.path === 'string') {
    // in case patch was created by user, check if patch is using string for path
    field = this.getField(patch.path);
    patch.path = field.path;
  }
  return patch;
}

export function changeHandler(patch) {
  patch = normalizePatchOrEvent.call(this, patch);

  const { onChange } = this.props;
  if (onChange && typeof onChange === 'function') {
    return onChange(patch);
  }
  if (!this._isMounted) { return false; }
  this.setState({value: update(this.state.value, patch)});
}

export function submitHandler(evt) {
  evt.preventDefault();
  const {onSubmit, onChange} = this.props;
  if (onSubmit && typeof onSubmit === 'function') {
    onSubmit(onChange ? evt : this.state.value.toJS());
  }
}

export function resetHandler(evt) {
  evt.preventDefault();
  const {onReset} = this.props;
  if (onReset && typeof onReset === 'function') {
    onReset(evt);
  }
  if (this._isMounted && this.state && this.state.value) {
    this.setState({value: Immutable.fromJS(this.props.value)})
  }
}


// *************************************
//  Deprecated
// *************************************
export function getName(name) {
  return this.getField(name).name;
}

// *************************************
//  Deprecated
// *************************************
export function getInValue(name) {
  return this.getField(name).value;
}

export const methodsForWrappedComponent = {
  getField, changeHandler, submitHandler, resetHandler, getName, getInValue
}
