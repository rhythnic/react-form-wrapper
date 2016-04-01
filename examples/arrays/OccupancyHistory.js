import React from 'react';
import OccupancyField from './OccupancyField';

export default function OccupancyHistory ({ name, value, onChange, push, remove }) {
  return <div>
    <h3>Occupancy History</h3>
    <button
      type="button"
      onClick={() => push(0)} >
      Add
    </button>
    <ul>
      {value.map((val, i) =>
      <li key={i}>
        <OccupancyField
          name={`${name}.${i}`}
          onChange={onChange}
          value={val}
          onRemove={() => remove(i)} />
      </li>)}
    </ul>
  </div>
}
