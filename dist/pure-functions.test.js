'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _pureFunctions = require('./pure-functions');

var _jsdomSetup = require('./jsdom-setup');

var _jsdomSetup2 = _interopRequireDefault(_jsdomSetup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _jsdomSetup2.default)();

(0, _tape2.default)('flattenPath', function (t) {

  var arr = ['one', ['two'], 'three', ['four', 'five']];
  var result = ['one', 'two', 'three', 'four'];
  t.same((0, _pureFunctions.flattenPath)(arr), result, "flattens any nested array to it's first element");
  t.end();
});

(0, _tape2.default)('createPathObjects', function (t) {

  var state = new _immutable.Map();
  var path = ['one', ['two'], '0', 'three'];
  var newState = _immutable2.default.fromJS({ one: { two: [{}] } });
  var result = (0, _pureFunctions.createPathObjects)(state, path);
  t.ok(_immutable2.default.is(result, newState), "creates values in state based on path, omitting last path item");
  t.end();
});

(0, _tape2.default)('buildPatchFromEvent', function (t) {

  var paths = {
    one: ['one'],
    two: ['one', ['two']]
  };

  var evts = {
    number: { target: { value: "1", type: 'number' } },
    text: { target: { value: 'val' } },
    checkBool: { target: { type: 'checkbox', checked: true } },
    checkAdd: { target: { type: 'checkbox', checked: true, value: 'item' } },
    checkRemove: { target: { type: 'checkbox', checked: false, value: 'item' } }
  };

  var results = {
    number: { op: 'replace', path: paths.one, value: 1 },
    text: { op: 'replace', path: paths.one, value: 'val' },
    checkBool: { op: 'replace', path: paths.one, value: true },
    checkAdd: { op: 'add', path: paths.two, value: 'item' },
    checkRemove: { op: 'remove', path: paths.two, value: 'item' }
  };

  // parses number values
  var res = (0, _pureFunctions.buildPatchFromEvent)(evts.text, paths.one);
  t.same(res, results.text, 'returns default patch with op replace');
  res = (0, _pureFunctions.buildPatchFromEvent)(evts.number, paths.one);
  t.same(res, results.number, 'parses number values');
  res = (0, _pureFunctions.buildPatchFromEvent)(evts.checkBool, paths.one);
  t.same(res, results.checkBool, 'sets boolean on checkbox for non-array leafs');
  res = (0, _pureFunctions.buildPatchFromEvent)(evts.checkAdd, paths.two);
  t.same(res, results.checkAdd, 'returns add patch on checkbox(true) for array leafs');
  res = (0, _pureFunctions.buildPatchFromEvent)(evts.checkRemove, paths.two);
  t.same(res, results.checkRemove, 'returns add patch on checkbox(false) for array leafs');
  t.end();
});

// export function buildPatchFromEvent(evt, path) {
//   let { type, value, checked } = evt.target;
//   switch(type) {
//     case 'checkbox':
//       return isArray(last(path))
//         ? { op: checked ? 'add' : 'remove', path, value }
//         : { op: 'replace', path, value: checked };
//     case 'select-multiple':
//       value = map(evt.target.querySelectorAll('option:checked'), 'value');
//       return { op: 'replace', path, value };
//     case 'number':
//       return { path, op: 'replace', value: parseInt(value, 10) };
//     default:
//       return { path, op: 'replace', value };
//   }
// }