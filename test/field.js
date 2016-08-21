import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { Map, List } from 'immutable';
import { flatten, difference, assign } from 'lodash';

import buildField, { extendField } from '../src/field';
import { FW } from './index';

const fwProps = {
  name: 'p'
}


test('buildField', function(t) {
  let wrapper = shallow(<FW { ...fwProps } />);

  const parent = wrapper.instance();
  let field = parent.getField('a');
  t.is(field.name, 'p.a', "Name is childname appended to parent name, separated by delimiter.");
  const propertyList = ['name', 'childName', 'parent', 'path', 'flatPath', 'pathToGetValue',
    'isArray', 'onChange', 'value', 'at', 'patch'];
  propertyList.forEach(p => t.ok(field.hasOwnProperty(p), `Field has prop ${p}`));
  const enumberableProps = ['name', 'onChange', 'value'];
  t.is(Object.keys(field).length, enumberableProps.length, "enumerable props are as expected.");
  let functionProps =['onChange', 'at', 'patch'];
  functionProps.forEach(p => t.ok(typeof field[p] === 'function', `${p} is a function on field.`));

  field = parent.getField('b[]');
  t.equal(field.isArray, true, "Recognizes array syntax in the name.");
  functionProps =['push', 'remove'];
  functionProps.forEach(p => t.ok(typeof field[p] === 'function', `${p} is a function on array fields.`));

  t.end();
});

test('field.at', function(t) {
  let wrapper = shallow(<FW { ...fwProps } />);

  const parent = wrapper.instance();
  let aField = parent.getField('a');
  const bField = aField.at('b');
  t.equal(bField.parent, parent, "Creates new field with same parent.");
  t.equal(bField.name, 'p.a.b', "Creates new field with pasted nested in current field.");

  t.end();
});


//
// test('Field push', function(t) {
//   const parent = formWrapperFactory();
//   let f = buildField(name.full, name.child, parent);
//   t.notOk(f.push, "Push is undefined if field is not an array field");
//   parent.state.value = Map({ childName: List() });
//   parent.changeHandler = sinon.spy();
//   f = buildField(name.arrayFull, name.arrayChild, parent);
//   let result = f.push(1);
//   let args = parent.changeHandler.getCall(0).args[0];
//   t.deepEqual(args, {op: 'add', path: f.path, value: 1}, "Calls onChange with add patch");
//   t.end();
// });
//
// test('Field remove', function(t) {
//   const parent = formWrapperFactory();
//   let f = buildField(name.full, name.child, parent);
//   t.notOk(f.remove, "Remove is undefined if field is not an array field");
//   parent.state.value = Map({ childName: List([true]) });
//   parent.changeHandler = sinon.spy();
//   f = buildField(name.arrayFull, name.arrayChild, parent);
//   let result = f.remove(0);
//   let args = parent.changeHandler.getCall(0).args[0];
//   t.deepEqual(args, {op: 'remove', path: [...f.path, 0 ]}, "Calls onChange with remove patch");
//   t.end();
// });
//
// test('extendField', function(t) {
//   const parent = formWrapperFactory();
//   let f = buildField(name.full, name.child, parent);
//   let result = extendField(f, {placeholder: 'Child Name'});
//   let expectedKeys = ['name', 'value', 'onChange', 'checked', 'placeholder', 'version'];
//   let diff = difference(Object.keys(result), expectedKeys);
//   t.equal(diff.length, 0, "Returns object with enumerable keys extended by props");
//   f = buildField(name.arrayFull, name.arrayChild, parent);
//   result = extendField(f, null, {toJS: true});
//   console.log('result.value', result.value);
//   t.ok(Array.isArray(result.value), "converts value to JS if toJS is true in opts");
//   result = extendField(f, {type: 'file'});
//   t.ok(result.key, "props contains unique key if props.type is file");
//   t.end();
// });
//
//
