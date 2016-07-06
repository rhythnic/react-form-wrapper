import React from 'react';
import FormWrapper from '../../../src';

function Profile({ field }) {
  return (
    <div>
      <div>
        <input { ...field('name') }
          placeholder="Name" />
        <input { ...field('roomCount') }
          placeholder="Room Count"
          type="number" />
        <input { ...field('roomsAvailable') }
          placeholder="Rooms Available"
          type="number" />
        <label> Has Cable
          <input { ...field('hasCable', { type: 'checkbox' }) } />
        </label>
      </div>
    </div>
  );
}

export default FormWrapper()(Profile);
