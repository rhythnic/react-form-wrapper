import React from 'react';
import FormWrapper from '../../form-wrapper';

function Profile({ field }) {
  const fileField = field('file', { type: 'file' });
  console.log(fileField);
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
          <input { ...field('hasCable') }
            type="checkbox" />
        </label>
      </div>
      <div>
        <input { ...fileField } />
      </div>

    </div>
  );
}

export default FormWrapper()(Profile);
