// import test from 'tape';
// import { Map, List } from 'immutable';
// import buildField, { extendField } from '../src/field';
// import sinon from 'sinon';
// import { flatten, difference, assign } from 'lodash';
// import { buildPath } from '../src/pure-functions';
//
// function formWrapperFactory() {
//   return {
//     props: { name: 'parent', delimiter: '.' },
//     changeHandler() {},
//     getField: sinon.spy(),
//     state: { value: Map({ child: true, arrayChild: [] }) }
//   }
// }
//
// const name = {
//   full: 'parent.child',
//   child: 'child',
//   arrayFull: 'parent.arrayChild[]',
//   arrayChild: 'arrayChild[]'
// };
//
//
// test('buildField', function(t) {
//   const parent = formWrapperFactory();
//   const f = buildField(name.full, name.child, parent);
//   t.equal(f.parent, parent, "stores parent as this.parent");
//   t.equal(f.childName, name.child, "stores child name as this.childName");
//   t.equal(f.name, name.full, "stores full name as this.name");
//   let path = buildPath(name.full, parent.props.delimiter);
//   t.deepEqual(f.path, path, "stores path as this.path");
//   let valuePath = flatten( buildPath(name.child, parent.props.delimiter) );
//   t.deepEqual(f.path, path, "stores path to value as this.valuePath");
//   let isArray = Array.isArray( path[ path.length - 1 ] );
//   t.equal(f.isArray, isArray, "stores isArray boolean as this.isArray");
//   t.equal(f.onChange, parent.changeHandler, "stores parent's changeHandler as this.onChange");
//   t.ok(f.checked, "checked is true if value is true boolean.");
//   let getValue = sinon.spy();
//   let value = f.value;
//   t.equal(f.value, true, "value getter calls getValue(this)");
//   t.end();
// });
//
// test('field at', function(t) {
//   const parent = formWrapperFactory();
//   let f = buildField(name.full, name.child, parent);
//   f.at('two');
//   t.ok(parent.getField.calledWith('child.two'), "Prepends field name to arg[0] and passes to parent.getField");
//   t.end();
// });
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
// test('patch', function(t) {
//   const parent = formWrapperFactory();
//   let field = buildField(name.full, name.child, parent);
//   let evt = { target: { type: 'text', value: '1' } };
//   let patch = {path: field.path, op: 'replace', value: '1', isNormalized: true};
//   t.deepEquals(field.patch(evt), patch, "creates replace patch by default");
//   evt = { target: { type: 'number', value: '1' } };
//   assign(patch, {value: 1});
//   t.deepEquals(field.patch(evt), patch, "converts string values to numbers for type number");
//   evt = { target: { type: 'checkbox', checked: true } };
//   assign(patch, {value: true});
//   t.deepEquals(field.patch(evt), patch, "sets non-array field to true for checked checkbox");
//   evt = { target: { type: 'checkbox', checked: false } };
//   assign(patch, {value: false});
//   t.deepEquals(field.patch(evt), patch, "sets non-array field to false for unchecked checkbox");
//   field = buildField(name.arrayFull, name.arrayChild, parent);
//   evt = { target: { type: 'checkbox', value: 'a', checked: true } };
//   assign(patch, { op: 'add', value: 'a', path: field.path });
//   t.deepEquals(field.patch(evt), patch,  "adds checked checkbox value to array field");
//   evt = { target: { type: 'checkbox', value: 'a', checked: false } };
//   assign(patch, { op: 'remove' });
//   t.deepEquals(field.patch(evt), patch,  "removes unchecked checkbox value to array field");
//   evt = { target: {
//     type: 'select-multiple',
//     options: [
//       { value: 'a', selected: true },
//       { value: 'b', selected: false },
//       { value: 'c', selected: true }
//     ]
//   }};
//   assign(patch, { op: 'replace', value: ['a', 'c'] });
//   t.deepEquals(field.patch(evt), patch,  "sets value to array of selected options for select-multiple");
//   t.end();
// });
