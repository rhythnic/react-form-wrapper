'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = update;
exports.getPatchFromEvent = getPatchFromEvent;

var _immutable = require('immutable');

function update(state, evt, delimiter) {
  var _getPatchFromEvent = getPatchFromEvent(evt);

  var op = _getPatchFromEvent.op;
  var path = _getPatchFromEvent.path;
  var value = _getPatchFromEvent.value;

  path = path.split(delimiter);

  switch (op) {
    case 'replace':
      return state.updateIn(path, function () {
        return value;
      });
    case 'add':
      return state.updateIn(path, (0, _immutable.List)(), function (val) {
        return val.push(value);
      });
    case 'remove':
      return state.updateIn(path, (0, _immutable.List)(), function (val) {
        return val.delete(val.indexOf(value));
      });
    default:
      return state;
  }
}

function getPatchFromEvent(evt) {
  if (!evt.target) {
    return evt;
  }
  var _evt$target = evt.target;
  var type = _evt$target.type;
  var name = _evt$target.name;
  var value = _evt$target.value;
  var checked = _evt$target.checked;

  switch (type) {
    case 'checkbox':
      var fieldType = evt.target.dataset.type;
      return fieldType === 'array' ? { op: checked ? 'add' : 'remove', path: name, value: value } : { op: 'replace', path: name, value: checked };
    case 'select-multiple':
      value = [].map.call(evt.target.querySelectorAll('option:checked'), function (o) {
        return o.value;
      });
      return { op: 'replace', path: name, value: new _immutable.List(value) };
    default:
      return { path: name, op: 'replace', value: value };
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