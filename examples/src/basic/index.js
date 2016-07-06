import React from 'react';
import FormWrapper from '../../../src';
import Profile from './Profile';
import Address from './Address';
import Immutable, { Map } from 'immutable';

function disableSubmit(value) {
  return !value || !value.getIn(['profile', 'name']);
}

function MyForm ({ submitHandler, resetHandler, field, value }) {
  return (
    <form onSubmit={ submitHandler } onReset={ resetHandler }>
      <Profile { ...field('profile') } />
      <Address { ...field('address') } />
      <button
        type="submit"
        disabled={disableSubmit(value)}>
        Submit
      </button>
      <button type="reset">Reset</button>
    </form>
  );
}

export default FormWrapper({ disableSubmit })(MyForm);
