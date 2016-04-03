// ***************************************************************
// These class methods brought out of the class definition
// because they are passed to the wrapped component, and so
// need to be bound to the class instance.
// ***************************************************************


import Immutable, {List, Map} from 'immutable';
import { update, buildPatchFromEvent, flattenPath } from './pure-functions';
import { isUndefined, isArray, isString, last, assign } from 'lodash'

const PATH_RE = /\[([\d]*)\]/;

export function isArrayField(name) {
  return isArray(last(getPath.call(this, name)));
}

export function getPath(name) {
  if (!(name in this._paths)) {
    const delimited = name.split(this._delimiter);
    const path = [];
    for (let i = 0; i < delimited.length; i++) {
      let match = PATH_RE.exec(delimited[i]);
      if (!match) {
        path.push(delimited[i]);
        continue;
      }
      path.push([ delimited[i].slice(0, match.index) ]);
      if (match[1]) {
        path.push(match[1]);
      }
    }
    this._paths[name] = path;
  }
  return this._paths[name];
}

export function pushItem(path, value) {
  changeHandler.call(this, { op: 'add', path, value })
}

export function removeItem(path, index) {
  changeHandler.call(this, { op: 'remove', path: [...path, index] });
}

export function getField(childName, props = {}, opts = {}) {
  const name = getName.call(this, childName);
  let field = this._fields[name];
  if (!field) {
    field = {
      name,
      onChange: this.changeHandler,
      at: getFieldAt.bind(this, childName)
    }
    if (isArrayField.call(this, name)) {
      field.push = pushItem.bind(this, name);
      field.remove = removeItem.bind(this, name);
    }
    this._fields[name] = field;
  }
  const base = {
    value: getInValue.call(this, childName, opts)
  };
  if (typeof base.value === 'boolean') {
    base.checked = base.value;
  }
  return assign(base, field, props);
}

export function getFieldAt(parentName, childName, ...other) {
  return getField.call(this, `${parentName}${this._delimiter}${childName}`, ...other);
}

export function getName(childName) {
  const { name } = this.props;
  return name ? `${name}${this._delimiter}${childName}` : childName;
}

export function changeHandler(patch) {
  if (!patch.op) {
    // normalize event to patch object
    const path = getPath.call(this, patch.target.name);
    patch = buildPatchFromEvent(patch, path);
  }
  if (isString(patch.path)) {
    patch.path = getPath.call(this, patch.path);
  }

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
    onSubmit(onChange ? evt : this.getValue({ toJS: true }));
  }
}

export function resetHandler(evt) {
  evt.preventDefault();
  if (!this._isMounted) { return false; }
  const {onReset} = this.props;
  if (onReset && typeof onReset === 'function') {
    return onReset(evt);
  }
  this.setState({value: Immutable.fromJS(this.props.value)})
}

export function getInValue(name, opts = {}) {
  const ctx = (this.state && this.state.value) || this.props.value;
  let value;
  if (ctx) {
    value = getValueInContext.call(this, ctx, name);
    value = List.isList(value) || (opts.toJS && Map.isMap(value))
      ? value.toJS()
      : value;
  }
  return isUndefined(value) && isArrayField.call(this, name)
    ? [] : value;
}

export function getValueInContext(ctx, name) {
  const path = flattenPath( getPath.call(this, name) );
  const result = ctx.getIn(path);
  return result;
}

export const methodsForWrappedComponent = {
  getField, getName, changeHandler, submitHandler, resetHandler, getInValue
}
