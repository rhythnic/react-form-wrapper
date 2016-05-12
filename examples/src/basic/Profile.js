import React from 'react';
import FormWrapper from '../../form-wrapper';

function Profile({ getField }) {
  return (
    <div>
      <input { ...getField('name') }
        placeholder="Name" />
      <input { ...getField('roomCount') }
        placeholder="Room Count"
        type="number" />
      <input { ...getField('roomsAvailable') }
        placeholder="Rooms Available"
        type="number" />
      <label> Has Cable
        <input { ...getField('hasCable') }
          type="checkbox" />
      </label>
    </div>
  );
}

export default FormWrapper()(Profile);
