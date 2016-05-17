import test from 'tape';
import { Map, List } from 'immutable';
import Field from '../src/field';
import sinon from 'sinon';
import { flatten, difference } from 'lodash';
import { buildPath, buildName } from '../src/pure-functions';

function formWrapperFactory() {
  return {
    props: { name: 'parent' },
    _delimiter: '.',
    changeHandler() {},
    getField: sinon.spy(),
    state: { value: Map({ childName: true }) }
  }
}

const childName = 'childName';

test('Field constructor', function(t) {
  const parent = formWrapperFactory();
  const f = new Field(childName, parent);
  t.equal(f.parent, parent, "stores parent as this.parent");
  t.equal(f.childName, childName, "stores child name as this.childName");
  let name = buildName(parent.props.name, childName, parent._delimiter);
  t.equal(f.name, name, "stores full name as this.name");
  let path = buildPath(name, parent._delimiter);
  t.deepEqual(f.path, path, "stores path as this.path");
  let valuePath = flatten( buildPath(childName, parent._delimiter) );
  t.deepEqual(f.path, path, "stores path to value as this.valuePath");
  let isArray = Array.isArray( path[ path.length - 1 ] );
  t.equal(f.name, name, "stores isArray boolean as this.isArray");
  t.equal(f.onChange, parent.changeHandler, "stores parent's changeHandler as this.onChange");
  t.ok(f.checked, "checked is true if value is true boolean.");
  f.getValue = sinon.spy();
  let value = f.value;
  t.ok(f.getValue.called, "value getter calls this.getStateFromParent");
  t.end();
});

test('Field getStateFromParent', function(t) {
  const parent = formWrapperFactory();
  let f = new Field(childName, parent);
  let result = f.getValue();
  t.equal(result, true, 'It returns state from parent context');
  parent.state.value = undefined;
  result = f.getValue();
  t.equal(result, '', 'It returns empty string if no context.');
  parent.state.value = new Map();
  result = f.getValue();
  t.equal(result, '', 'It returns empty string if path not in context.');
  f = new Field(`${childName}[]`, parent);
  result = f.getValue();
  t.ok(List.isList(result), 'It returns List if value is undefined on array field');
  result = f.getValue({ toJS: true });
  t.ok(Array.isArray(result), 'It returns JS object if value is List or Map and opts.toJS is true');
  t.end();
});

test('Field checkIsArray', function(t) {
  const parent = formWrapperFactory();
  let f = new Field(childName, parent);
  t.throws(f.checkIsArray.bind(f), "Throws error if field is not an array field");
  f = new Field(`${childName}[]`, parent);
  t.doesNotThrow(f.checkIsArray.bind(f), "Doesn't throw if field is an array");
  t.end();
});

test('Field at', function(t) {
  const parent = formWrapperFactory();
  let f = new Field(childName, parent);
  f.at('two');
  t.ok(parent.getField.calledWith('childName.two'), "Calls parent.getField with childname.atArg");
  t.end();
});

test('Field push', function(t) {
  const parent = formWrapperFactory();
  let f = new Field(childName, parent);
  t.throws(f.push.bind(f), "Throws error if field is not an array field");
  parent.state.value = Map({ childName: List() });
  parent.changeHandler = sinon.spy();
  f = new Field(`${childName}[]`, parent);
  let result = f.push(1);
  let args = parent.changeHandler.getCall(0).args[0];
  t.deepEqual(args, {op: 'add', path: f.path, value: 1}, "Calls onChange with add patch");
  t.end();
});

test('Field remove', function(t) {
  const parent = formWrapperFactory();
  let f = new Field(childName, parent);
  t.throws(f.push.bind(f), "Throws error if field is not an array field");
  parent.state.value = Map({ childName: List([true]) });
  parent.changeHandler = sinon.spy();
  f = new Field(`${childName}[]`, parent);
  let result = f.remove(0);
  let args = parent.changeHandler.getCall(0).args[0];
  t.deepEqual(args, {op: 'remove', path: [...f.path, 0 ]}, "Calls onChange with remove patch");
  t.end();
});

test('Field withProps', function(t) {
  const parent = formWrapperFactory();
  let f = new Field(childName, parent);
  let result = f.withProps({placeholder: 'Child Name'});
  let expectedKeys = ['name', 'value', 'onChange', 'checked', 'placeholder', 'version', 'error'];
  let diff = difference(Object.keys(result), expectedKeys);
  t.equal(diff.length, 0, "Returns object with enumerable keys extended by props");
  f.getValue = sinon.spy();
  result = f.withProps(null, {toJS: true});
  let args = f.getValue.getCall(0).args[0];
  t.deepEqual(args, {toJS: true}, "calls getValue with toJS=true if toJS is true in opts");
  result = f.withProps({type: 'file'});
  t.ok(result.key, "props contains unique key if props.type is file");
  t.end();
});
