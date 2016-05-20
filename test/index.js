import React from 'react';
import test from 'tape';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { createRenderer } from 'react-addons-test-utils';
import { assign, isFunction, isObject } from 'lodash';
import FormWrapper from '../src';
import Immutable, { Map } from 'immutable';


function WrappedForm({ onSubmit, onReset }) {
  return <form onSubmit={ onSubmit } onRest={ onReset }></form>;
}

const FormWrapperInstance = FormWrapper()(WrappedForm);


test('FormWrapper Parent', function (t) {

  const onSubmit = sinon.spy();

  const wrapper = mount(<FormWrapperInstance passed={true} onSubmit={onSubmit} value={{ one: 1 }}/>);

  const instance = wrapper.instance();
  t.ok( isObject(instance._fields), 'Sets fields cache object on instance.');
  t.equal( instance._delimiter, '.', 'Uses period character as default delimiter.');
  t.ok( instance._isMounted, 'Sets _isMounted boolean to true on mount.');

  let value = wrapper.state('value');
  t.ok( Immutable.is(value, Immutable.fromJS({ one: 1})), "Sets state to Immutable version of value prop.");
  t.deepEqual(value.toJS(), instance.getValue({toJS: true}), "Returns value when getValue called.");

  const child = wrapper.find(WrappedForm);
  t.is(child.length, 1, "Renders wrapped component.");

  const props = child.props();
  t.ok( props.passed, "Wrapped component receives passed props.");
  t.ok( isFunction(props.onSubmit), "Wrapped component receives onSubmit function.");
  t.ok( isFunction(props.onReset),  "Wrapped component receives onReset function.");
  t.ok( isFunction(props.onChange), "Wrapped component receives onChange function.");
  t.ok( isFunction(props.getName), "Wrapped component receives getName function.");
  t.ok( isFunction(props.getField), "Wrapped component receives getField function.");
  t.ok( isFunction(props.getValue), "Wrapped component receives getValue function.");

  child.find('form').simulate('submit');
  t.ok( onSubmit.called, 'onSubmit prop is called on form submit');



  wrapper.unmount();
  t.notOk( instance._isMounted, 'Sets _isMounted boolean to false on unmount.');

  t.end();

});


function WrappedInput({ onChange }) {
  return <input name="two" />;
}


test('FormWrapper Nested', function (t) {

  const onChange = sinon.spy();

  const wrapper = mount(<FormWrapperInstance onChange={onChange} />);

  const state = wrapper.state();
  t.deepEqual( state, { submitIsDisabled: false }, "Nested state contains only submitIsDisabled");

  t.end();

});
