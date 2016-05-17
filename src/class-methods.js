// ***************************************************************
// These class methods brought out of the class definition
// because they are passed to the wrapped component, and so
// need to be bound to the class instance.
// ***************************************************************


import Immutable from 'immutable';
import { update, buildPatchFromEvent } from './pure-functions';
import Field from './field';


export function getField(childName, props, opts) {
  const name = !this.props.name || (opts && opts.isFullName)
    ? childName
    : `${this.props.name}${this._delimiter}${childName}`;
  let field = this._fields[name];
  if (!field) {
    field = new Field(name, childName, this);
    this._fields[name] = field;
  }
  return props || (opts && opts.toJS)
    ? field.withProps(props, opts)
    : field;
}

export function normalizePatchOrEvent(patch) {
  // check if patch is an input event
  let field;
  if (typeof patch.preventDefault === 'function') {
    // normalize event to patch object
    field = this._fields[patch.target.name] ||
            getField.call(this, patch.target.name, null, { isFullName: true });
    patch = buildPatchFromEvent(patch, field);
  } else if (typeof patch.path === 'string') {
    // in case patch was created by user, check if patch is using string for path
    field = this._fields[patch.path] ||
            getField.call(this, patch.path, null, { isFullName: true });
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
  const { onReset } = this.props;
  if (onReset && typeof onReset === 'function') {
    onReset(evt);
  }
  if (this._isMounted && this.state) {
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
