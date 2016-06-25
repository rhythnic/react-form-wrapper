import test from 'tape';
import Immutable, { List, Map } from 'immutable';
import {
  createPathObjects,
  update,
  getValue,
  buildPath } from '../src/pure-functions';


test('createPathObjects', function (t) {
  const state = new Map();
  const path = ['one', ['two'], '0', 'three'];
  const newState = Immutable.fromJS({ one: { two: [ {} ] } });
  const result = createPathObjects(state, path);
  t.ok(Immutable.is(result, newState), "create values in state based on path, omitting last path item");
  t.end();
});


test('update', function (t) {
  let oldState = new Map({ one: 'a' });
  let newState = oldState.set('one', 'b');
  let patch = new Map({ op: 'replace', path: ['one'], value: 'b' });
  let result = update(oldState, patch);
  t.ok(result.equals(newState), "op: replace, replaces value at path");
  patch = new Map({ op: 'add', path: [ ['two'] ], value: 'a' });
  newState = oldState.update('two', List(), list => list.push('a'));
  result = update(oldState, patch);
  t.ok(result.equals(newState), "op: add, pushes value to List");
  patch = new Map({ op: 'remove', path: [ 'one' ] });
  newState = oldState.delete('one');
  result = update(oldState, patch);
  t.ok(result.equals(newState), "op: remove, removes item at path when no value in patch");
  oldState = new Map({ two: List.of('a', 'b')});
  patch = new Map({ op: 'remove', path: [ ['two'] ], value: 'a' });
  newState = oldState.deleteIn(['two', 0]);
  result = update(oldState, patch);
  t.ok(result.equals(newState), "op: remove, removes value from array at path when no value in patch");
  oldState = new Map({});
  patch = new Map({ op: 'replace', path: [ 'one' ], value: { a: [] } });
  newState = oldState.set('one', Map({ a: List() }));
  result = update(oldState, patch);
  t.ok(result.equals(newState), "converts nested JS values to Immutable equivalent");
  oldState = new Map({});
  const date = new Date();
  patch = new Map({ op: 'replace', path: [ 'one' ], value: date });
  newState = oldState.set('one', date);
  result = update(oldState, patch);
  t.equal(result.get('one'), date, "Only converts plain objects");
  t.end();
});


test('buildPath', function (t) {
  const delimiter = '.';
  let name = 'one.two';
  let path = ['one', 'two'];
  let result = buildPath(name, delimiter);
  t.deepEqual(result, path, 'returns name split by delimiter');
  name = 'one.two[]';
  path = [ 'one', ['two'] ];
  result = buildPath(name, delimiter);
  t.deepEqual(result, path, 'converts JS object property notation to nested arrays');
  path = ['one', ['two'], '0']
  let names = [ 'one.two[0]', 'one.two[].0' ];
  let results = [ buildPath(names[0], delimiter), buildPath(names[1], delimiter) ];
  t.deepEqual(results[0], results[1], 'It treats [0] and [].0 equally');
  t.end();
});
