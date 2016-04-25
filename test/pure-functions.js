import test from 'tape';
import Immutable, { List, Map } from 'immutable';
import { createPathObjects, buildPatchFromEvent, update } from '../src/pure-functions';


test('createPathObjects', function (t) {
  const state = new Map();
  const path = ['one', ['two'], '0', 'three'];
  const newState = Immutable.fromJS({ one: { two: [ {} ] } });
  const result = createPathObjects(state, path);
  t.ok(Immutable.is(result, newState), "create values in state based on path, omitting last path item");
  t.end();
});


test('buildPatchFromEvent', function (t) {
  let evt = { target: { type: 'text', value: '1' } };
  let path = ['one', 'two' ];
  let patch = { path, op: 'replace', value: '1' };
  t.deepEqual(buildPatchFromEvent(evt, path), patch, "creates replace patch by default");
  evt = { target: { type: 'number', value: '1' } };
  patch = { path, op: 'replace', value: 1 };
  t.deepEqual(buildPatchFromEvent(evt, path), patch, "converts string values to numbers for type number");
  evt = { target: { type: 'checkbox', checked: true } };
  patch = { path, op: 'replace', value: true };
  t.deepEqual(buildPatchFromEvent(evt, path), patch, "sets non-array field to true for checked checkbox");
  evt = { target: { type: 'checkbox', checked: false } };
  patch = { path, op: 'replace', value: false };
  t.deepEqual(buildPatchFromEvent(evt, path), patch, "sets non-array field to false for unchecked checkbox");
  path = ['one', ['two']];
  evt = { target: { type: 'checkbox', value: 'a', checked: true } };
  patch = { path, op: 'add', value: 'a' };
  t.deepEqual(buildPatchFromEvent(evt, path), patch, "adds checked checkbox value to array field");
  evt = { target: { type: 'checkbox', value: 'a', checked: false } };
  patch = { path, op: 'remove', value: 'a' };
  t.deepEqual(buildPatchFromEvent(evt, path), patch, "removes unchecked checkbox value to array field");
  evt = { target: {
    type: 'select-multiple',
    options: [
      { value: 'a', selected: true },
      { value: 'b', selected: false },
      { value: 'c', selected: true }
    ]
  }};
  patch = { path, op: 'replace', value: ['a', 'c'] };
  t.deepEqual(buildPatchFromEvent(evt, path), patch, "sets value to array of selected options for select-multiple");
  t.end();
});


test('update', function (t) {
  let oldState = new Map({ one: 'a' });
  let newState = oldState.set('one', 'b');
  let patch = { op: 'replace', path: ['one'], value: 'b' };
  let result = update(oldState, patch);
  t.ok(Immutable.is(result, newState), "op: replace, replaces value at path");
  patch = { op: 'add', path: [ ['two'] ], value: 'a' };
  newState = oldState.update('two', List(), list => list.push('a'));
  result = update(oldState, patch);
  t.ok(Immutable.is(result, newState), "op: add, pushes value to List");
  patch = { op: 'remove', path: [ 'one' ] };
  newState = oldState.delete('one');
  result = update(oldState, patch);
  t.ok(Immutable.is(result, newState), "op: remove, removes item at path when no value in patch");
  oldState = new Map({ two: List.of('a', 'b')});
  patch = { op: 'remove', path: [ ['two'] ], value: 'a' };
  newState = oldState.deleteIn(['two', 0]);
  result = update(oldState, patch);
  t.ok(Immutable.is(result, newState), "op: remove, removes value from array at path when no value in patch");
  oldState = new Map({});
  patch = { op: 'replace', path: [ 'one' ], value: {} };
  newState = oldState.set('one', Map());
  result = update(oldState, patch);
  t.ok(Immutable.is(result, newState), "converts object values to Maps");
  oldState = new Map({});
  patch = { op: 'replace', path: [ ['one'] ], value: [] };
  newState = oldState.set('one', List());
  result = update(oldState, patch);
  t.ok(Immutable.is(result, newState), "converts array values to Lists");
  t.end();
});
