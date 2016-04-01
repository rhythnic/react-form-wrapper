import React from 'react';
import FormWrapper from '../form-wrapper';

function Address({ getField }) {
  return (
    <div>
      <p>Address</p>
      <input { ...getField('street') }
        placeholder="Street" />
      <input { ...getField('city') }
        placeholder="City" />
      <input { ...getField('country') }
        placeholder="Country" />
    </div>
  );
}

export default FormWrapper()(Address);
