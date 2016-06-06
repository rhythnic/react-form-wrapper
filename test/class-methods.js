import test from 'tape';
import sinon from 'sinon';
import { assign, isFunction, isObject, isArray } from 'lodash';
import Immutable, { Map, List } from 'immutable';
import { changeHandler, submitHandler, resetHandler, normalizePatchOrEvent,
  getField, getName, getInValue } from '../src/class-methods';


function selfFactory() {
  return {
    state: { value: new Map(), version: 0 },
    _fields: {},
    _delimiter: '.',
    _isMounted: true,
    props: {},
    changeHandler() {},
    setState: sinon.spy()
  };
}


test('normalizePatchOrEvent', function (t) {
  const self = selfFactory();
  let evt = { target: { name: 'one', value: 1 }, preventDefault: function() {} }
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


test('getField', function (t) {
  const self = selfFactory();
  self.props.name = 'parent';
  self._fields['parent.one'] = {};
  let result = getField.call(self, 'one');
  t.equal(result, self._fields['parent.one'], "returns field from cache");
  result = getField.call(self, 'two');
  t.equal(result, self._fields['parent.two'], "caches new fields");
  self._fields['parent.three'] = { value: 1, version: 0, name: 'parent.three' };
  let props = { type: 'file' };
  result = getField.call(self, 'three', props);
  let expected = { key: 'parent.three_0', value: undefined, type: 'file', name: 'parent.three', version: 0 };
  t.deepEqual(result, expected, ' if props or opts present, return altered field');
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
  self.props.onReset = sinon.spy();
  resetHandler.call(self, evt);
  let onResetArg = self.props.onReset.getCall(0).args[0];
  t.equal(onResetArg, evt, 'If props.onReset, it forwards event to props.onReset');
  self.setState.reset();
  self.props.value = { one: 1 };
  resetHandler.call(self, evt);
  let setStateArg = self.setState.getCall(0).args[0];
  t.ok(Immutable.is(setStateArg.value, Map(self.props.value)), 'if state, sets state.value to props.value');
  t.equal(setStateArg.version, 1, 'if state, increment state.version');
  self._isMounted = false;
  t.notOk(resetHandler.call(self, evt), 'if not mounted, does not set state');
  t.end();
});


test('getName', function (t) {
  const self = selfFactory();
  self.props.name = 'one';
  const expected = 'one.two';
  let result = getName.call(self, 'two');
  t.equal(result, expected, 'returns name of field');
  t.end();
});


test('getInValue', function (t) {
  const self = selfFactory();
  self.props.name = 'one';
  self._fields['one.two'] = { value: 1 };
  let result = getInValue.call(self, 'two');
  t.equal(result, 1, 'returns value of field');
  t.end();
});
