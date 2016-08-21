//
//
// test('createPathObjects', function (t) {
//   const state = new Map();
//   const path = ['one', ['two'], '0', 'three'];
//   const newState = Immutable.fromJS({ one: { two: [ {} ] } });
//   const result = createPathObjects(state, path);
//   t.ok(Immutable.is(result, newState), "create values in state based on path, omitting last path item");
//   t.end();
// });
//
//
// test('update', function (t) {
//   let oldState = new Map({ one: 'a' });
//   let newState = oldState.set('one', 'b');
//   let patch = { op: 'replace', path: ['one'], value: 'b' };
//   let result = update(oldState, patch);
//   t.ok(result.equals(newState), "op: replace, replaces value at path");
//   patch = { op: 'add', path: [ ['two'] ], value: 'a' };
//   newState = oldState.update('two', List(), list => list.push('a'));
//   result = update(oldState, patch);
//   t.ok(result.equals(newState), "op: add, pushes value to List");
//   patch = { op: 'remove', path: [ 'one' ] };
//   newState = oldState.delete('one');
//   result = update(oldState, patch);
//   t.ok(result.equals(newState), "op: remove, removes item at path when no value in patch");
//   oldState = new Map({ two: List.of('a', 'b')});
//   patch = { op: 'remove', path: [ ['two'] ], value: 'a' };
//   newState = oldState.deleteIn(['two', 0]);
//   result = update(oldState, patch);
//   t.ok(result.equals(newState), "op: remove, removes value from array at path when no value in patch");
//   oldState = new Map({});
//   patch = { op: 'replace', path: [ 'one' ], value: { a: [] } };
//   newState = oldState.set('one', Map({ a: List() }));
//   result = update(oldState, patch);
//   t.ok(result.equals(newState), "converts nested JS values to Immutable equivalent");
//   oldState = new Map({});
//   const date = new Date();
//   patch = { op: 'replace', path: [ 'one' ], value: date };
//   newState = oldState.set('one', date);
//   result = update(oldState, patch);
//   t.equal(result.get('one'), date, "Only converts plain objects");
//   t.end();
// });
