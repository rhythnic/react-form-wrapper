import React from 'react';
import FormWrapper from '../../form-wrapper';

function Address({ field }) {
  return (
    <div>
      <p>Address</p>
      <input { ...field('street') }
        placeholder="Street" />
      <input { ...field('city') }
        placeholder="City" />
      <input { ...field('country') }
        placeholder="Country" />
    </div>
  );
}

export default FormWrapper()(Address);
