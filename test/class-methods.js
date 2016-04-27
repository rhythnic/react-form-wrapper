import test from 'tape';
import sinon from 'sinon';
import { assign, isFunction, isObject, isArray } from 'lodash';
import Immutable, { Map, List } from 'immutable';
import { getPath, PATH_ARRAY_RE, isArrayField, changeHandler, normalizePatchOrEvent,
  pushItem, removeItem, makeField, getField, getFieldAt, getName, submitHandler,
  resetHandler, getInValue, getValueInContext } from '../src/class-methods';

function selfFactory() {
  return {
    state: { value: new Map() },
    _paths: {},
    _fields: {},
    _delimiter: '.',
    _isMounted: true,
    props: {},
    changeHandler() {},
    setState: sinon.spy()
  };
}


test('getPath', function (t) {
  const self = selfFactory();
  let result = getPath.call(self, 'one');
  t.equal(result, self._paths.one, 'It caches new names, and returns path from cache if possible.');
  let { name, path } = { name: 'one.two[]', path: [ 'one', ['two'] ] };
  result = getPath.call(self, name);
  t.deepEqual(self._paths[name], path, 'It converts JSON syntax to array');
  path = ['one', ['two'], '0']
  let names = [ 'one.two[0]', 'one.two[].0' ];
  let results = [ getPath.call(self, names[0]), getPath.call(self, names[1]) ];
  t.deepEqual(results[0], results[1], 'It treats [0] and [].0 equally');
  t.end();
});


test('isArrayField', function (t) {
  const self = selfFactory();
  t.ok(isArrayField.call(self, 'one.two[]'),     'It returns true if the last node in the path is an array.');
  t.notOk(isArrayField.call(self, 'one.three'),  'It returns false if the last node in the path is not an array');
  t.notOk(isArrayField.call(self, 'one.two[0]'), 'It returns false if the last node is an index in an array');
  t.end();
});


test('normalizePatchOrEvent', function (t) {
  const self = selfFactory();
  let evt = { target: { name: 'one', value: 1 } }
  let patch = { op: 'replace', path: ['one'], value: 1 };
  let result = normalizePatchOrEvent.call(self, evt);
  t.deepEqual(result, patch, 'It normalizes event to patch');
  const patch2 = { op: 'replace', path: 'one', value: 1 };
  result = normalizePatchOrEvent.call(self, patch2);
  t.deepEqual(result.path, ['one'], 'It converts string path to array form');
  t.end();
});


test('changeHandler', function (t) {
  const self = selfFactory();
  let patch = { op: 'replace', path: ['one'], value: 1 };
  let result = changeHandler.call(self, patch);
  let setStateArg = self.setState.getCall(0).args[0];
  let value = new Map({one: 1});
  t.ok(Immutable.is(setStateArg.value, value), 'It updates state.value by applying patch if onChange is not a prop.');
  self.props.onChange = sinon.spy();
  result = changeHandler.call(self, patch);
  t.ok(self.props.onChange.calledWith(patch), 'If onChange is a prop, it is invoked with the patch.');
  t.end();
});


test('pushItem', function (t) {
  const self = selfFactory();
  self.props.onChange = sinon.spy();
  pushItem.call(self, 'one', 'a');
  const expected = { op: 'add', path: ['one'], value: 'a' };
  const result = self.props.onChange.getCall(0).args[0]
  t.deepEqual(result, expected, 'It calls changeHandler with patch object.');
  t.end();
});


test('removeItem', function (t) {
  const self = selfFactory();
  self.props.onChange = sinon.spy();
  removeItem.call(self, [['one']], 0);
  const expected = { op: 'remove', path: [['one'], 0] };
  const result = self.props.onChange.getCall(0).args[0]
  t.deepEqual(result, expected, 'It calls changeHandler with patch object.');
  t.end();
});


test('makeField', function (t) {
  const self = selfFactory();
  let name = 'one.two';
  let childName = 'two';
  let result = makeField.call(self, name, childName);
  t.equal(result.name, name, 'The result contains name as property.');
  t.ok(isFunction(result.onChange), 'The result contains function "onChange"');
  t.ok(isFunction(result.at), 'The result contains function "at".');
  t.ok(isObject(self._fields['one.two']), 'It caches the result');
  name = 'one.three[]';
  childName = 'three[]';
  result = makeField.call(self, name, childName);
  t.ok(isFunction(result.push), 'The result contains "push" function for array fields');
  t.ok(isFunction(result.push), 'The result contains "remove" function for array fields');
  t.end();
});


test('getField', function (t) {
  const self = selfFactory();
  self.state.value = new Map({one: 1, two: List()});
  let props = { multiple: true };
  let result = getField.call(self, 'one', props, {});
  t.ok(result.multiple, 'It assigns props argument into result object');
  t.equal(result.value, 1, 'Result contains value at childName');
  result = getField.call(self, 'two', props, {});
  t.ok(isArray(result.value), 'Value is an array if props.multiple.');
  t.equal(result.name, 'two', 'The result contains name as property.');
  t.ok(isFunction(result.onChange), 'The result contains function "onChange"');
  t.ok(isFunction(result.at), 'The result contains function "at".');
  t.end();
});


test('getFieldAt', function (t) {
  const self = selfFactory();
  const field = getField.call(self, 'one');
  const atField = field.at('two');
  const expected = getFieldAt.call(self, 'one', 'two');
  t.deepEqual(atField, expected, 'calls getField with with path of childName');
  t.end();
});


test('getName', function (t) {
  const self = selfFactory();
  self.props.name = 'one';
  const expected = 'one.two';
  const result = getName.call(self, 'two');
  t.equal(result, expected, 'appends childName to this.props.name');
  t.end();
});


test('submitHandler', function (t) {
  const self = selfFactory();
  self.props.onSubmit = sinon.spy();
  const evt = { preventDefault() {} };
  let result = submitHandler.call(self, evt);
  let resultArg = self.props.onSubmit.getCall(0).args[0];
  t.deepEqual(resultArg, self.state.value.toJS(), 'If not props.onChange, it passes JS value to props.onSubmit');
  self.props.onSubmit.reset();
  self.props.onChange = sinon.spy();
  result = submitHandler.call(self, evt);
  resultArg = self.props.onSubmit.getCall(0).args[0];
  t.equal(resultArg, evt, 'If props.onChange, it forwards event to props.submitHandler');
  t.end();
});


test('resetHandler', function (t) {
  const self = selfFactory();
  const evt = { preventDefault() {} };
  self.props.value = {one: 1};
  resetHandler.call(self, evt);
  let setStateArg = self.setState.getCall(0).args[0];
  t.ok(Immutable.is(setStateArg.value, Map(self.props.value)), 'If not props.onReset, it sets state.value to props.value');
  self.props.onReset = sinon.spy();
  resetHandler.call(self, evt);
  let onResetArg = self.props.onReset.getCall(0).args[0];
  t.equal(onResetArg, evt, 'If props.onReset, it forwards event to props.onReset');
  self._isMounted = false;
  t.equal(resetHandler.call(self, evt), false, 'returns false if component not mounted');
  t.end();
});


test('getValueInContext', function (t) {
  const self = selfFactory();
  let ctx = new Map({one: 1, two: List('a')});
  let name = 'one';
  let result = getValueInContext.call(self, ctx, name);
  t.equal(result, 1, 'It gets value in context at path.');
  name = 'two[]';
  result = getValueInContext.call(self, ctx, name);
  t.ok(Immutable.is(result, List('a')), 'It flattens path before looking up value.');
  t.end();
});


test('getInValue', function (t) {
  const self = selfFactory();
  self.state.value = self.props.value = undefined;
  let result = getInValue.call(self, 'one');
  t.notOk(result, 'It returns undefined if no context.');
  self.props.value = new Map();
  result = getInValue.call(self, 'one');
  t.notOk(result, 'It returns undefined if path not in context.');
  result = getInValue.call(self, 'one[]');
  t.ok(List.isList(result), 'It returns List if value is undefined on array field');
  result = getInValue.call(self, 'one[]', { toJS: true });
  t.ok(isArray(result), 'It returns JS object if value is List or Map and opts.toJS is true');
  self.props.value = new Map({ one: 1 });
  result = getInValue.call(self, 'one');
  t.equal(result, 1, 'It returns value in context');
  t.end();
});
