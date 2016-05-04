'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = exports.methodsForWrappedComponent = undefined;
exports.isArrayField = isArrayField;
exports.getPath = getPath;
exports.pushItem = pushItem;
exports.removeItem = removeItem;
exports.makeField = makeField;
exports.getField = getField;
exports.getFieldAt = getFieldAt;
exports.getName = getName;
exports.normalizePatchOrEvent = normalizePatchOrEvent;
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

var PATH_ARRAY_RE = /\[([\d]*)\]/;

function isArrayField(name) {
  return _get__('isArray')(_get__('last')(_get__('getPath').call(this, name)));
}

function getPath(name) {
  if (!(name in this._paths)) {
    var delimited = name.split(this._delimiter);
    var path = [];
    for (var i = 0; i < delimited.length; i++) {
      var match = _get__('PATH_ARRAY_RE').exec(delimited[i]);
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
  _get__('changeHandler').call(this, { op: 'add', path: path, value: value });
}

function removeItem(path, index) {
  _get__('changeHandler').call(this, { op: 'remove', path: [].concat(_toConsumableArray(path), [index]) });
}

function makeField(name, childName) {
  var path = _get__('getPath').call(this, name);
  var field = {
    name: name,
    onChange: this.changeHandler,
    at: _get__('getFieldAt').bind(this, childName)
  };
  if (_get__('isArrayField').call(this, name)) {
    field.push = _get__('pushItem').bind(this, path);
    field.remove = _get__('removeItem').bind(this, path);
  }
  this._fields[name] = field;
  return field;
}

function getField(childName, props, opts) {
  props = props || {};
  opts = opts || {};
  var name = _get__('getName').call(this, childName);
  var field = this._fields[name] || _get__('makeField').call(this, name, childName);
  if (props.multiple) {
    // convert List to Array for select multiple
    opts = _get__('assign')({ toJS: true }, opts);
  }
  var base = {
    value: _get__('getInValue').call(this, childName, opts)
  };
  if (typeof base.value === 'boolean') {
    base.checked = base.value;
  }
  return _get__('assign')(base, field, props);
}

function getFieldAt(parentName, childName) {
  var _get__2;

  for (var _len = arguments.length, other = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    other[_key - 2] = arguments[_key];
  }

  return (_get__2 = _get__('getField')).call.apply(_get__2, [this, '' + parentName + this._delimiter + childName].concat(other));
}

function getName(childName) {
  var name = this.props.name;

  return name ? '' + name + this._delimiter + childName : childName;
}

function normalizePatchOrEvent(patch) {
  // check if patch is an input event
  if (!patch.op) {
    // normalize event to patch object
    var path = _get__('getPath').call(this, patch.target.name);
    patch = _get__('buildPatchFromEvent')(patch, path);
  }
  // in case patch was created by user, check if patch is using string for path
  if (_get__('isString')(patch.path)) {
    patch.path = _get__('getPath').call(this, patch.path);
  }
  return patch;
}

function changeHandler(patch) {
  patch = _get__('normalizePatchOrEvent').call(this, patch);

  var onChange = this.props.onChange;

  if (onChange && typeof onChange === 'function') {
    return onChange(patch);
  }
  if (!this._isMounted) {
    return false;
  }
  this.setState({ value: _get__('update')(this.state.value, patch) });
}

function submitHandler(evt) {
  evt.preventDefault();
  var _props = this.props;
  var onSubmit = _props.onSubmit;
  var onChange = _props.onChange;

  if (onSubmit && typeof onSubmit === 'function') {
    onSubmit(onChange ? evt : this.state.value.toJS());
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
  this.setState({ value: _get__('Immutable').fromJS(this.props.value) });
}

function getInValue(name) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var ctx = this.state && this.state.value || this.props.value;
  var value = undefined;
  if (ctx) {
    value = _get__('getValueInContext').call(this, ctx, name);
  }
  if (_get__('isUndefined')(value) && _get__('isArrayField').call(this, name)) {
    value = _get__('List')();
  }
  if (opts.toJS && (_get__('List').isList(value) || _get__('Map').isMap(value))) {
    value = value.toJS();
  }
  return value;
}

function getValueInContext(ctx, name) {
  var path = _get__('flatten')(_get__('getPath').call(this, name));
  return ctx.getIn(path);
}

var methodsForWrappedComponent = exports.methodsForWrappedComponent = {
  getField: _get__('getField'), getName: _get__('getName'), changeHandler: _get__('changeHandler'), submitHandler: _get__('submitHandler'), resetHandler: _get__('resetHandler'), getInValue: _get__('getInValue')
};
var _RewiredData__ = {};
var _RewireAPI__ = {};

(function () {
  function addPropertyToAPIObject(name, value) {
    Object.defineProperty(_RewireAPI__, name, {
      value: value,
      enumerable: false,
      configurable: true
    });
  }

  addPropertyToAPIObject('__get__', _get__);
  addPropertyToAPIObject('__GetDependency__', _get__);
  addPropertyToAPIObject('__Rewire__', _set__);
  addPropertyToAPIObject('__set__', _set__);
  addPropertyToAPIObject('__reset__', _reset__);
  addPropertyToAPIObject('__ResetDependency__', _reset__);
  addPropertyToAPIObject('__with__', _with__);
})();

function _get__(variableName) {
  return _RewiredData__ === undefined || _RewiredData__[variableName] === undefined ? _get_original__(variableName) : _RewiredData__[variableName];
}

function _get_original__(variableName) {
  switch (variableName) {
    case 'isArray':
      return _lodash.isArray;

    case 'last':
      return _lodash.last;

    case 'getPath':
      return getPath;

    case 'PATH_ARRAY_RE':
      return PATH_ARRAY_RE;

    case 'changeHandler':
      return changeHandler;

    case 'getFieldAt':
      return getFieldAt;

    case 'isArrayField':
      return isArrayField;

    case 'pushItem':
      return pushItem;

    case 'removeItem':
      return removeItem;

    case 'getName':
      return getName;

    case 'makeField':
      return makeField;

    case 'assign':
      return _lodash.assign;

    case 'getInValue':
      return getInValue;

    case 'getField':
      return getField;

    case 'buildPatchFromEvent':
      return _pureFunctions.buildPatchFromEvent;

    case 'isString':
      return _lodash.isString;

    case 'normalizePatchOrEvent':
      return normalizePatchOrEvent;

    case 'update':
      return _pureFunctions.update;

    case 'Immutable':
      return _immutable2.default;

    case 'getValueInContext':
      return getValueInContext;

    case 'isUndefined':
      return _lodash.isUndefined;

    case 'List':
      return _immutable.List;

    case 'Map':
      return _immutable.Map;

    case 'flatten':
      return _lodash.flatten;

    case 'submitHandler':
      return submitHandler;

    case 'resetHandler':
      return resetHandler;
  }

  return undefined;
}

function _assign__(variableName, value) {
  if (_RewiredData__ === undefined || _RewiredData__[variableName] === undefined) {
    return _set_original__(variableName, value);
  } else {
    return _RewiredData__[variableName] = value;
  }
}

function _set_original__(variableName, _value) {
  switch (variableName) {}

  return undefined;
}

function _update_operation__(operation, variableName, prefix) {
  var oldValue = _get__(variableName);

  var newValue = operation === '++' ? oldValue + 1 : oldValue - 1;

  _assign__(variableName, newValue);

  return prefix ? newValue : oldValue;
}

function _set__(variableName, value) {
  return _RewiredData__[variableName] = value;
}

function _reset__(variableName) {
  delete _RewiredData__[variableName];
}

function _with__(object) {
  var rewiredVariableNames = Object.keys(object);
  var previousValues = {};

  function reset() {
    rewiredVariableNames.forEach(function (variableName) {
      _RewiredData__[variableName] = previousValues[variableName];
    });
  }

  return function (callback) {
    rewiredVariableNames.forEach(function (variableName) {
      previousValues[variableName] = _RewiredData__[variableName];
      _RewiredData__[variableName] = object[variableName];
    });
    var result = callback();

    if (!!result && typeof result.then == 'function') {
      result.then(reset).catch(reset);
    } else {
      reset();
    }

    return result;
  };
}

exports.__get__ = _get__;
exports.__GetDependency__ = _get__;
exports.__Rewire__ = _set__;
exports.__set__ = _set__;
exports.__ResetDependency__ = _reset__;
exports.__RewireAPI__ = _RewireAPI__;
exports.default = _RewireAPI__;