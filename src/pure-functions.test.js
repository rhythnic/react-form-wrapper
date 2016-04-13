import test from 'tape';
import Immutable, { Map, List } from 'immutable';
import { flattenPath, createPathObjects, buildPatchFromEvent } from './pure-functions';

import setupDom from './jsdom-setup';
setupDom();


test('flattenPath', function (t) {

  const arr = [ 'one', ['two'], 'three', ['four', 'five']];
  const result = ['one', 'two', 'three', 'four'];
  t.same(flattenPath(arr), result, "flattens any nested array to it's first element");
  t.end();

});


test('createPathObjects', function (t) {

  const state = new Map();
  const path = ['one', ['two'], '0', 'three'];
  const newState = Immutable.fromJS({ one: { two: [ {} ] } });
  const result = createPathObjects(state, path);
  t.ok(Immutable.is(result, newState), "creates values in state based on path, omitting last path item")
  t.end();

});


test('buildPatchFromEvent', function (t) {

  const paths = {
    one: [ 'one' ],
    two: [ 'one', [ 'two' ] ]
  };

  const evts = {
    number: { target: { value: "1", type: 'number' } },
    text:   { target: { value: 'val' } },
    checkBool: { target: { type: 'checkbox', checked: true } },
    checkAdd:  { target: { type: 'checkbox', checked: true, value: 'item' } },
    checkRemove:  { target: { type: 'checkbox', checked: false, value: 'item' } }
  };

  const results = {
    number: { op: 'replace', path: paths.one, value: 1 },
    text:   { op: 'replace', path: paths.one, value: 'val' },
    checkBool: { op: 'replace', path: paths.one, value: true },
    checkAdd:  { op: 'add', path: paths.two, value: 'item' },
    checkRemove: { op: 'remove', path: paths.two, value: 'item' }
  };

  // parses number values
  let res = buildPatchFromEvent(evts.text, paths.one);
  t.same(res, results.text, 'returns default patch with op replace');
  res = buildPatchFromEvent(evts.number, paths.one);
  t.same(res, results.number, 'parses number values');
  res = buildPatchFromEvent(evts.checkBool, paths.one);
  t.same(res, results.checkBool, 'sets boolean on checkbox for non-array leafs');
  res = buildPatchFromEvent(evts.checkAdd, paths.two);
  t.same(res, results.checkAdd, 'returns add patch on checkbox(true) for array leafs');
  res = buildPatchFromEvent(evts.checkRemove, paths.two);
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
