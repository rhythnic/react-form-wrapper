'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flattenPath = flattenPath;
exports.createPathObjects = createPathObjects;
exports.update = update;
exports.buildPatchFromEvent = buildPatchFromEvent;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function flattenPath(path) {
  return (0, _lodash.map)(path, function (item) {
    return Array.isArray(item) ? item[0] : item;
  });
}

function createPathObjects(state, path) {
  var i = 0,
      key = undefined,
      isArr = undefined,
      value = undefined,
      setPath = [];
  for (; i < path.length - 1; i++) {
    isArr = (0, _lodash.isArray)(path[i]);
    key = isArr ? path[i][0] : path[i];
    setPath[i] = key;
    if ((0, _lodash.isNil)(state.getIn(setPath))) {
      state = state.setIn(setPath, isArr ? new _immutable.List() : new _immutable.Map());
    }
  }
  return state;
}

function update(state, _ref) {
  var op = _ref.op;
  var path = _ref.path;
  var value = _ref.value;

  state = createPathObjects(state, path);
  path = flattenPath(path);
  if ((0, _lodash.isArray)(value)) {
    value = (0, _immutable.List)(value);
  } else if (value.constructor === Object) {
    value = (0, _immutable.Map)(value);
  }
  switch (op) {
    case 'replace':
      return state.updateIn(path, function () {
        return value;
      });
    case 'add':
      return state.updateIn(path, (0, _immutable.List)(), function (list) {
        return list.push(value);
      });
    case 'remove':
      return _.isUndefined(value) ? state.deleteIn(path) : state.updateIn(path, (0, _immutable.List)(), function (list) {
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
      return (0, _lodash.isArray)((0, _lodash.last)(path)) ? { op: checked ? 'add' : 'remove', path: path, value: value } : { op: 'replace', path: path, value: checked };
    case 'select-multiple':
      value = (0, _lodash.map)(evt.target.querySelectorAll('option:checked'), 'value');
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