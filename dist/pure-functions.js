'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;
exports.createPathObjects = createPathObjects;
exports.update = update;
exports.buildPatchFromEvent = buildPatchFromEvent;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createPathObjects(state, path) {
  var i = 0,
      key = undefined,
      isArr = undefined,
      value = undefined,
      setPath = [];
  for (; i < path.length - 1; i++) {
    isArr = _get__('isArray')(path[i]);
    key = isArr ? path[i][0] : path[i];
    setPath[i] = key;
    if (_get__('isNil')(state.getIn(setPath))) {
      state = state.setIn(setPath, isArr ? new (_get__('List'))() : new (_get__('Map'))());
    }
  }
  return state;
}

function update(state, _ref) {
  var op = _ref.op;
  var path = _ref.path;
  var value = _ref.value;

  state = _get__('createPathObjects')(state, path);
  path = _get__('flatten')(path);
  if (op !== 'remove' && !_get__('isNil')(value)) {
    if (_get__('isArray')(value)) {
      value = _get__('List')(value);
    } else if (value.constructor === Object) {
      value = _get__('Map')(value);
    }
  }
  switch (op) {
    case 'replace':
      return state.updateIn(path, function () {
        return value;
      });
    case 'add':
      return state.updateIn(path, _get__('List')(), function (list) {
        return list.push(value);
      });
    case 'remove':
      return _get__('isNil')(value) ? state.deleteIn(path) : state.updateIn(path, _get__('List')(), function (list) {
        return list.delete(list.indexOf(value));
      });
    default:
      return state;
  }
}

function buildPatchFromEvent(evt, path) {
  var _evt$target = evt.target;
  var type = _evt$target.type;
  var value = _evt$target.value;
  var checked = _evt$target.checked;

  switch (type) {
    case 'checkbox':
      return _get__('isArray')(_get__('last')(path)) ? { op: checked ? 'add' : 'remove', path: path, value: value } : { op: 'replace', path: path, value: checked };
    case 'select-multiple':
      value = _get__('map')(_get__('filter')(evt.target.options, 'selected'), 'value');
      return { op: 'replace', path: path, value: value };
    case 'number':
      return { path: path, op: 'replace', value: parseInt(value, 10) };
    default:
      return { path: path, op: 'replace', value: value };
  }
}

// JSON PATCH Examples
// [
//    { "op": "test", "path": "/a/b/c", "value": "foo" },
//    { "op": "remove", "path": "/a/b/c" },
//    { "op": "add", "path": "/a/b/c", "value": [ "foo", "bar" ] },
//    { "op": "replace", "path": "/a/b/c", "value": 42 },
//    { "op": "move", "from": "/a/b/c", "path": "/a/b/d" },
//    { "op": "copy", "from": "/a/b/d", "path": "/a/b/e" }
//  ]
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

    case 'isNil':
      return _lodash.isNil;

    case 'List':
      return _immutable.List;

    case 'Map':
      return _immutable.Map;

    case 'createPathObjects':
      return createPathObjects;

    case 'flatten':
      return _lodash.flatten;

    case 'last':
      return _lodash.last;

    case 'map':
      return _lodash.map;

    case 'filter':
      return _lodash.filter;
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