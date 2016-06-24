import React from 'react';
import FormWrapper from '../../form-wrapper';
import Profile from './Profile';
import Address from './Address';
import Immutable, { Map } from 'immutable';

// *************************************
//  NOTE
//  submitIsDisabled and disableSubmit are a Temporary API, until validation is implemented
// *************************************

function MyForm ({ onSubmit, onReset, field, submitIsDisabled, value }) {
  return <form { ...{ onSubmit, onReset } }>
    <Profile { ...field('profile') } />
    <Address { ...field('address') } />
    <button type="submit" disabled={ submitIsDisabled }>Submit</button>
    <button type="reset">Reset</button>
  </form>;
}

function disableSubmit(value) {
  return !value || !value.getIn(['profile', 'name']);
}

export default FormWrapper({ disableSubmit })(MyForm);
