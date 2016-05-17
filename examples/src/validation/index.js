import React from 'react';
import FormWrapper from '../../form-wrapper';
import Profile from './Profile';
import Address from './Address';


function MyForm ({ onSubmit, onReset, field }) {
  return <form { ...{ onSubmit, onReset } }>
    <Profile { ...field('profile') } />
    <Address { ...field('address') } />
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </form>;
}


const validation = [
  {
    // name scopes validation object
    name: 'address.country',

     // event that triggers validation function
    run: [ 'blur' ],

    // event that clears validation errors,
    clear: [ 'change' ],

    // function to run
    validate(formValue, fieldName, fieldValue) {
      return fieldValue !== 'USA';
    }
  }
];


export default FormWrapper({ validation })(MyForm);
