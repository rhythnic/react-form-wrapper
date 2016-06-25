// ***************************************************************
// These class methods brought out of the class definition
// because they are passed to the wrapped component, and so
// need to be bound to the class instance.
// ***************************************************************


import Immutable from 'immutable';
import { update, buildPatchFromEvent } from './pure-functions';
import buildField, { extendField } from './field';
import { Map } from 'immutable';

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

export function normalizePatchOrEvent(x, isMap) {
  // patch is either an event, or a custom patch
  // a custom patch is either an object or a Map
  const isEvt = !isMap && typeof x.preventDefault === 'function';
  const path = isEvt ? x.target.name : isMap ? x.get('path') : x.path;
  if (typeof path !== 'string') {
    throw new Error('The path property of a custom patch should be of type string');
  }
  const field = this._fields[path] || getField.call(this, path, null, { isFullName: true });
  return isEvt ? field.patch(x) : (isMap ? x : new Map(x)).set('path', field.path);
}

export function changeHandler(patch) {
  const isMap = Map.isMap(patch);
  if (!isMap || !patch.get('isFieldPatch')) {
    patch = normalizePatchOrEvent.call(this, patch, isMap);
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
