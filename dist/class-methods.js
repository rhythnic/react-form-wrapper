'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.methodsForWrappedComponent = undefined;
exports.isArrayField = isArrayField;
exports.getPath = getPath;
exports.pushItem = pushItem;
exports.removeItem = removeItem;
exports.getField = getField;
exports.getFieldAt = getFieldAt;
exports.getName = getName;
exports.changeHandler = changeHandler;
exports.submitHandler = submitHandler;
exports.resetHandler = resetHandler;
exports.getInValue = getInValue;
exports.getValueInContext = getValueInContext;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _pureFunctions = require('./pure-functions');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // ***************************************************************
// These class methods brought out of the class definition
// because they are passed to the wrapped component, and so
// need to be bound to the class instance.
// ***************************************************************

var PATH_RE = /\[([\d]*)\]/;

function isArrayField(name) {
  return (0, _lodash.isArray)((0, _lodash.last)(getPath.call(this, name)));
}

function getPath(name) {
  if (!(name in this._paths)) {
    var delimited = name.split(this._delimiter);
    var path = [];
    for (var i = 0; i < delimited.length; i++) {
      var match = PATH_RE.exec(delimited[i]);
      if (!match) {
        path.push(delimited[i]);
        continue;
      }
      path.push([delimited[i].slice(0, match.index)]);
      if (match[1]) {
        path.push(match[1]);
      }
    }
    this._paths[name] = path;
  }
  return this._paths[name];
}

function pushItem(path, value) {
  changeHandler.call(this, { op: 'add', path: path, value: value });
}

function removeItem(path, index) {
  changeHandler.call(this, { op: 'remove', path: [].concat(_toConsumableArray(path), [index]) });
}

function getField(childName) {
  var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var name = getName.call(this, childName);
  var field = this._fields[name];
  if (!field) {
    field = {
      name: name,
      onChange: this.changeHandler,
      at: getFieldAt.bind(this, childName)
    };
    if (isArrayField.call(this, name)) {
      field.push = pushItem.bind(this, name);
      field.remove = removeItem.bind(this, name);
    }
    this._fields[name] = field;
  }
  var base = {
    value: getInValue.call(this, childName, opts)
  };
  if (typeof base.value === 'boolean') {
    base.checked = base.value;
  }
  return (0, _lodash.assign)(base, field, props);
}

function getFieldAt(parentName, childName) {
  for (var _len = arguments.length, other = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    other[_key - 2] = arguments[_key];
  }

  return getField.call.apply(getField, [this, '' + parentName + this._delimiter + childName].concat(other));
}

function getName(childName) {
  var name = this.props.name;

  return name ? '' + name + this._delimiter + childName : childName;
}

function changeHandler(patch) {
  if (!patch.op) {
    // normalize event to patch object
    var path = getPath.call(this, patch.target.name);
    patch = (0, _pureFunctions.buildPatchFromEvent)(patch, path);
  }
  if ((0, _lodash.isString)(patch.path)) {
    patch.path = getPath.call(this, patch.path);
  }

  var onChange = this.props.onChange;

  if (onChange && typeof onChange === 'function') {
    return onChange(patch);
  }
  if (!this._isMounted) {
    return false;
  }
  this.setState({ value: (0, _pureFunctions.update)(this.state.value, patch) });
}

function submitHandler(evt) {
  evt.preventDefault();
  var _props = this.props;
  var onSubmit = _props.onSubmit;
  var onChange = _props.onChange;

  if (onSubmit && typeof onSubmit === 'function') {
    onSubmit(onChange ? evt : this.getValue({ toJS: true }));
  }
}

function resetHandler(evt) {
  evt.preventDefault();
  if (!this._isMounted) {
    return false;
  }
  var onReset = this.props.onReset;

  if (onReset && typeof onReset === 'function') {
    return onReset(evt);
  }
  this.setState({ value: _immutable2.default.fromJS(this.props.value) });
}

function getInValue(name) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var ctx = this.state && this.state.value || this.props.value;
  var value = undefined;
  if (ctx) {
    value = getValueInContext.call(this, ctx, name);
    value = _immutable.List.isList(value) || opts.toJS && _immutable.Map.isMap(value) ? value.toJS() : value;
  }
  return (0, _lodash.isUndefined)(value) && isArrayField.call(this, name) ? [] : value;
}

function getValueInContext(ctx, name) {
  var path = (0, _pureFunctions.flattenPath)(getPath.call(this, name));
  var result = ctx.getIn(path);
  return result;
}

var methodsForWrappedComponent = exports.methodsForWrappedComponent = {
  getField: getField, getName: getName, changeHandler: changeHandler, submitHandler: submitHandler, resetHandler: resetHandler, getInValue: getInValue
};