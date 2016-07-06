import React from 'react';
import test from 'tape';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { createRenderer } from 'react-addons-test-utils';
import { assign, isFunction, isObject } from 'lodash';
import FormWrapper from '../src';
import Immutable, { Map } from 'immutable';


function Form({ submitHandler, resetHandler }) {
  return <form onSubmit={ submitHandler } onRest={ resetHandler }></form>;
}

function buildEvent() {
  return { preventDefault: sinon.spy() };
}

const FW = FormWrapper()(Form);


test('FormWrapper shallow', function(t) {

  let onChange = sinon.spy();
  let value = {a: 'a'};

  // uncontrolled form wrapper
  let wrapper = shallow(<FW { ...{ value } }/>);
  t.equal(wrapper.find('Form').length, 1, "Renders wrapped component");
  t.ok(wrapper.state('value'), "Should have state.value if no onChange prop.");
  t.equal(wrapper.state('value'), wrapper.props().value, "Should pass state value down as props if uncontrolled.");
  t.ok(wrapper.props().submitHandler, "Passes submitHandler to props.");
  t.ok(wrapper.props().resetHandler, "Passes resetHandler to props");

  // controlled form wrapper
  wrapper = shallow(<FW { ...{ onChange, value } } />);
  t.equal(wrapper.props().value, value, "Should pass value to props if controlled.");

  // props that can't change
  wrapper = shallow(<FW { ...{ onChange, delimiter: '/', name: '' } } />);
  t.throws(wrapper.setProps.bind(wrapper, { onChange: null } ), "Throws error if onChange prop changes.");
  t.throws(wrapper.setProps.bind(wrapper, { delimiter: '.' } ), "Throws error if delimiter prop changes.");
  t.throws(wrapper.setProps.bind(wrapper, { name: 'b' } ), "Throws error if name prop changes.");

  t.end();
});


test('Form Wrapper mount', function(t) {
  let value = {a: 'a'};
  let wrapper = mount(<FW { ...{ value } }/>);
  wrapper.setState({ value: Map({a: 'b'}) });
  let newValue = { a: 'a' };
  wrapper.setProps({ value: newValue });
  t.ok(wrapper.state('value').equals(Map(value)), "Sets state.value to props.value if props.value changes.");
  t.end();
});


test('Form Wrapper onSubmit', function(t) {
  let onSubmit = sinon.spy();
  let evt = buildEvent();
  let value = {a: 'a'};
  let wrapper = mount(<FW { ...{ value, onSubmit } }/>);
  wrapper.instance().submitHandler(evt);
  t.deepEqual(onSubmit.args[0][0], value, "onSubmit called with JS value of state.");
  t.ok(evt.preventDefault.calledOnce, "submitHandler calls event.preventDefault");
  t.end();
});


test('Form Wrapper onReset', function(t) {
  let onReset = sinon.spy();
  let evt = buildEvent();
  let value = {a: 'a'};
  let wrapper = mount(<FW { ...{ value, onReset } }/>);
  wrapper.setState({ value: Map({a: 'b'}) });
  wrapper.instance().resetHandler(evt);
  t.deepEqual(onReset.args[0][0], evt, "onReset called with reset event");
  t.ok(evt.preventDefault.calledOnce, "resetHandler calls event.preventDefault");
  t.ok(wrapper.state('value').equals(Map(value)), "Sets state.value to props.value on reset.");
  t.equal(wrapper.state('version'), 1, "Updates version onReset.");
  t.end();
});


test('Form Wrapper getField', function(t) {
  let wrapper = shallow(<FW { ...{ name: 'parent' } }/>);
  let field = wrapper.instance().getField('one');
  t.equal(field, wrapper.instance().fieldCache['parent.one'], "caches new fields");
  field = {}
  wrapper.instance().fieldCache['parent.two'] = field;
  t.equal(field, wrapper.instance().getField('two'), "returns field from cache")
  let fieldOpts = { type: 'file' };
  field = wrapper.instance().getField('three', fieldOpts);
  t.ok(field.isAlteredByType, "Returns altered result if opts present.");
  field = { isAlteredByType: true };
  wrapper.instance().fieldCache['parent.four'] = field;
  t.equal(field, wrapper.instance().getField('four', fieldOpts), "Does not attempt to alter field with opts if field has isAlteredByType prop.");
  t.end();
});


test('Form Wrapper getValue', function(t) {
  let value = { a: 'a' };
  let onChange = sinon.spy();
  let wrapper = shallow(<FW { ...{ value } }/>);
  let newValue = Map({a: 'b'});
  wrapper.setState({ value: newValue});
  t.ok(wrapper.instance().getValue().equals(newValue), "Should return state.value on uncontrolled wrappers.");
  wrapper = shallow(<FW { ...{ value, onChange } }/>);
  t.equal(wrapper.instance().getValue(), value, "Should return props.value on controlled wrappers.");
  t.end();
});


test('Form Wrapper changeHandler', function(t) {
  let evt = buildEvent();
  evt.target = { name: 'parent.one' };
  let value = { one: 'a' };
  let patch = {op: 'replace', isPatch: true, path: ['parent', 'one'], value: 'b' };
  let onChange = sinon.spy();
  let wrapper = shallow(<FW { ...{ value, name: 'parent', onChange } }/>);
  let field = { patch: sinon.stub().returns(patch) };
  wrapper.instance().fieldCache['parent.one'] = field;
  wrapper.instance().changeHandler(evt);
  t.ok(field.patch.calledOnce, "Calls cached field's patch method for events.");
  t.ok(onChange.calledWith(patch), "Calls onChange prop with patch.");
  wrapper.instance().changeHandler(patch);
  t.ok(field.patch.calledOnce, "Does not call field.patch if patch received in arguments.");

  wrapper = mount(<FW { ...{ value } }/>);
  patch = {op: 'replace', isPatch: true, path: ['one'], value: 'b' };
  wrapper.instance().changeHandler(patch);
  t.equal(wrapper.state('value').get('one'), 'b', "Applies patch to state value when uncontrolled.")
  t.end();
});
