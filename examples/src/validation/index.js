import React from 'react';
import FormWrapper from '../../form-wrapper';
import Profile from './Profile';
import Address from './Address';
import schema from './schema.json';


function MyForm ({ onSubmit, onReset, field }) {
  return <form { ...{ onSubmit, onReset } }>
    <div>
      <input {...field('name')} />
    </div>
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </form>;
}


export default FormWrapper({ schema })(MyForm);
