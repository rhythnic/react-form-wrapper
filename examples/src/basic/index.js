import React from 'react';
import FormWrapper from '../../form-wrapper';
import Profile from './Profile';
import Address from './Address';

function MyForm ({ onSubmit, onReset, getField }) {
  return <form { ...{ onSubmit, onReset } }>
    <Profile { ...getField('profile') } />
    <Address { ...getField('address') } />
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </form>;
}

export default FormWrapper()(MyForm);
