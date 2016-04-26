import test from 'tape';
import sinon from 'sinon';
import { assign, isFunction, isObject, isArray } from 'lodash';
import Immutable, { Map, List } from 'immutable';
import { getPath, PATH_ARRAY_RE, isArrayField, changeHandler, normalizePatchOrEvent,
  pushItem, removeItem, makeField, getValueInContext, getField } from '../src/class-methods';

function selfFactory() {
  return {
    state: { value: new Map() },
    _paths: {},
    _fields: {},
    _delimiter: '.',
    _isMounted: true,
    props: {},
    changeHandler() {},
    setState(vals) {
      this.state = assign({}, this.state, vals);
    }
  };
}


test('getPath', function (t) {
  const self = selfFactory();
  let result = getPath.call(self, 'one');
  t.equal(result, self._paths.one, "It caches new names, and returns path from cache if possible.");
  let { name, path } = { name: 'one.two[]', path: [ 'one', ['two'] ] };
  result = getPath.call(self, name);
  t.deepEqual(self._paths[name], path, "It converts JSON syntax to array");
  path = ['one', ['two'], '0']
  let names = [ 'one.two[0]', 'one.two[].0' ];
  let results = [ getPath.call(self, names[0]), getPath.call(self, names[1]) ];
  t.deepEqual(results[0], results[1], "It treats [0] and [].0 equally");
  t.end();
});


test('isArrayField', function (t) {
  const self = selfFactory();
  t.ok(isArrayField.call(self, 'one.two[]'),     "It returns true if the last node in the path is an array.");
  t.notOk(isArrayField.call(self, 'one.three'),  "It returns false if the last node in the path is not an array");
  t.notOk(isArrayField.call(self, 'one.two[0]'), "It returns false if the last node is an index in an array");
  t.end();
});


test('normalizePatchOrEvent', function (t) {
  const self = selfFactory();
  let evt = { target: { name: 'one', value: 1 } }
  let patch = { op: 'replace', path: ['one'], value: 1 };
  let result = normalizePatchOrEvent.call(self, evt);
  t.deepEqual(result, patch, "It normalizes event to patch");
  const patch2 = { op: 'replace', path: 'one', value: 1 };
  result = normalizePatchOrEvent.call(self, patch2);
  t.deepEqual(result.path, ['one'], "It converts string path to array form");
  t.end();
});


test('changeHandler', function (t) {
  const self = selfFactory();
  let patch = { op: 'replace', path: ['one'], value: 1 };
  let result = changeHandler.call(self, patch);
  let value = new Map({one: 1});
  t.ok(Immutable.is(self.state.value, value), "It updates state.value by applying patch if onChange is not a prop.");
  self.props.onChange = sinon.spy();
  result = changeHandler.call(self, patch);
  t.ok(self.props.onChange.calledWith(patch), "If onChange is a prop, it is invoked with the patch.");
  t.end();
});


test('pushItem', function (t) {
  const self = selfFactory();
  self.props.onChange = sinon.spy();
  pushItem.call(self, 'one', 'a');
  const expected = { op: 'add', path: ['one'], value: 'a' };
  const result = self.props.onChange.getCall(0).args[0]
  t.deepEqual(result, expected, "It calls changeHandler with patch object.");
  t.end();
});


test('removeItem', function (t) {
  const self = selfFactory();
  self.props.onChange = sinon.spy();
  removeItem.call(self, [['one']], 0);
  const expected = { op: 'remove', path: [['one'], 0] };
  const result = self.props.onChange.getCall(0).args[0]
  t.deepEqual(result, expected, "It calls changeHandler with patch object.");
  t.end();
});


test('makeField', function (t) {
  const self = selfFactory();
  let name = 'one.two';
  let childName = 'two';
  let result = makeField.call(self, name, childName);
  t.equal(result.name, name, "The result contains name as property.");
  t.ok(isFunction(result.onChange), "The result contains function 'onChange'");
  t.ok(isFunction(result.at), "The result contains function 'at'.");
  t.ok(isObject(self._fields['one.two']), "It caches the result");
  name = 'one.three[]';
  childName = 'three[]';
  result = makeField.call(self, name, childName);
  t.ok(isFunction(result.push), "The result contains 'push' function for array fields");
  t.ok(isFunction(result.push), "The result contains 'remove' function for array fields");
  t.end();
});



test('getField', function (t) {
  const self = selfFactory();
  self.state.value = new Map({one: 1, two: List()});
  let props = { multiple: true };
  let result = getField.call(self, 'one', props, {});
  t.ok(result.multiple, "It assigns props argument into result object");
  t.equal(result.value, 1, "Result contains value at childName");
  result = getField.call(self, 'two', props, {});
  t.ok(isArray(result.value), "Value is an array if props.multiple.");
  t.equal(result.name, 'two', "The result contains name as property.");
  t.ok(isFunction(result.onChange), "The result contains function 'onChange'");
  t.ok(isFunction(result.at), "The result contains function 'at'.");
  t.end();
});



test('getValueInContext', function (t) {
  const self = selfFactory();
  let ctx = new Map({one: 1, two: List('a')});
  let name = 'one';
  let result = getValueInContext.call(self, ctx, name);
  t.equal(result, 1, "It gets value in context at path.");
  name = 'two[]';
  result = getValueInContext.call(self, ctx, name);
  t.ok(Immutable.is(result, List('a')), "It flattens path before looking up value.");
  t.end();
});
