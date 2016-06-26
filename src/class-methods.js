// ***************************************************************
// These class methods brought out of the class definition
// because they are passed to the wrapped component, and so
// need to be bound to the class instance.
// ***************************************************************


import Immutable from 'immutable';
import { update, buildPatchFromEvent, buildPath } from './pure-functions';
import buildField, { extendField } from './field';
import { assign } from 'lodash';

export function getField(childName, props, opts) {
  const name = !this.props.name || (opts && opts.isFullName)
    ? childName
    : `${this.props.name}${this._delimiter}${childName}`;
  let field = this._fields[name];
  if (!field) {
    field = this._fields[name] = buildField(name, childName, this);
  }
  return props || (opts && opts.toJS)
    ? extendField(field, props, opts)
    : field;
}

export function normalizePatchOrEvent(x) {
  // patch is either an event, or a custom patch
  if (typeof x.preventDefault === 'function') {
    const path = x.target.name;
    const field = this._fields[path] || getField.call(this, path, null, { isFullName: true });
    return field.patch(x);
  }
  return assign({}, x, {
    isNormalized: true,
    path: Array.isArray(x.path) ? x.path : buildPath(x.path, this._delimiter)
  });
}

export function changeHandler(patch) {
  if (!patch.isNormalized) {
    patch = normalizePatchOrEvent.call(this, patch);
  }
  if (this._isFieldset) { return this.props.onChange(patch); }
  if (!this._isMounted) { return false; }
  const value = update(this.state.value, patch);
  this.setState({
    value,
    submitIsDisabled: !!this._disableSubmit && this._disableSubmit(value)
  });
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
  const { onReset } = this.props;
  if (onReset && typeof onReset === 'function') {
    onReset(evt);
  }
  if (this._isMounted && this.state.value) {
    this.setState({
      value: Immutable.fromJS(this.props.value),
      version: this.state.version + 1
    });
  }
}



// *************************************
//  Deprecated as Public API
// *************************************
export function getName(name) {
  return getField.call(this, name).name;
}

// *************************************
//  Deprecated
// *************************************
export function getInValue(name) {
  // name = buildName(this.props.name, name, this._delimiter);
  return getField.call(this, name).value;
}

export const methodsForWrappedComponent = {
  getField, changeHandler, submitHandler, resetHandler, getName, getInValue
}
