import test from 'tape';
import { Map, List } from 'immutable';
import buildField, { extendField } from '../src/field';
import sinon from 'sinon';
import { flatten, difference } from 'lodash';
import { buildPath } from '../src/pure-functions';

function formWrapperFactory() {
  return {
    props: { name: 'parent' },
    _delimiter: '.',
    changeHandler() {},
    getField: sinon.spy(),
    state: { value: Map({ child: true, arrayChild: [] }) }
  }
}

const name = {
  full: 'parent.child',
  child: 'child',
  arrayFull: 'parent.arrayChild[]',
  arrayChild: 'arrayChild[]'
};


test('buildField', function(t) {
  const parent = formWrapperFactory();
  const f = buildField(name.full, name.child, parent);
  t.equal(f.parent, parent, "stores parent as this.parent");
  t.equal(f.childName, name.child, "stores child name as this.childName");
  t.equal(f.name, name.full, "stores full name as this.name");
  let path = buildPath(name.full, parent._delimiter);
  t.deepEqual(f.path, path, "stores path as this.path");
  let valuePath = flatten( buildPath(name.child, parent._delimiter) );
  t.deepEqual(f.path, path, "stores path to value as this.valuePath");
  let isArray = Array.isArray( path[ path.length - 1 ] );
  t.equal(f.isArray, isArray, "stores isArray boolean as this.isArray");
  t.equal(f.onChange, parent.changeHandler, "stores parent's changeHandler as this.onChange");
  t.ok(f.checked, "checked is true if value is true boolean.");
  let getValue = sinon.spy();
  let value = f.value;
  t.equal(f.value, true, "value getter calls getValue(this)");
  t.end();
});

test('field at', function(t) {
  const parent = formWrapperFactory();
  let f = buildField(name.full, name.child, parent);
  f.at('two');
  t.ok(parent.getField.calledWith('child.two'), "Prepends field name to arg[0] and passes to parent.getField");
  t.end();
});

test('Field push', function(t) {
  const parent = formWrapperFactory();
  let f = buildField(name.full, name.child, parent);
  t.notOk(f.push, "Push is undefined if field is not an array field");
  parent.state.value = Map({ childName: List() });
  parent.changeHandler = sinon.spy();
  f = buildField(name.arrayFull, name.arrayChild, parent);
  let result = f.push(1);
  let args = parent.changeHandler.getCall(0).args[0];
  t.deepEqual(args, {op: 'add', path: f.path, value: 1}, "Calls onChange with add patch");
  t.end();
});

test('Field remove', function(t) {
  const parent = formWrapperFactory();
  let f = buildField(name.full, name.child, parent);
  t.notOk(f.remove, "Remove is undefined if field is not an array field");
  parent.state.value = Map({ childName: List([true]) });
  parent.changeHandler = sinon.spy();
  f = buildField(name.arrayFull, name.arrayChild, parent);
  let result = f.remove(0);
  let args = parent.changeHandler.getCall(0).args[0];
  t.deepEqual(args, {op: 'remove', path: [...f.path, 0 ]}, "Calls onChange with remove patch");
  t.end();
});

test('extendField', function(t) {
  const parent = formWrapperFactory();
  let f = buildField(name.full, name.child, parent);
  let result = extendField(f, {placeholder: 'Child Name'});
  let expectedKeys = ['name', 'value', 'onChange', 'checked', 'placeholder', 'version'];
  let diff = difference(Object.keys(result), expectedKeys);
  t.equal(diff.length, 0, "Returns object with enumerable keys extended by props");
  f = buildField(name.arrayFull, name.arrayChild, parent);
  result = extendField(f, null, {toJS: true});
  console.log('result.value', result.value);
  t.ok(Array.isArray(result.value), "converts value to JS if toJS is true in opts");
  result = extendField(f, {type: 'file'});
  t.ok(result.key, "props contains unique key if props.type is file");
  t.end();
});
