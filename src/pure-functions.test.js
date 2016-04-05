import test from 'tape';
import Immutable, { Map, List } from 'immutable';
import { flattenPath, createPathObjects } from './pure-functions';

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
