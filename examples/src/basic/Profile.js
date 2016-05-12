import React from 'react';
import FormWrapper from '../../form-wrapper';

function Profile({ field }) {
  return (
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
        <input { ...field('hasCable') }
          type="checkbox" />
      </label>
    </div>
  );
}

export default FormWrapper()(Profile);
