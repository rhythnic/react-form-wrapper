import React from 'react';
import OccupancyField from './OccupancyField';

export default function OccupancyHistory ({ history }) {
  return <div>
    <h3>Occupancy History</h3>
    <button
      type="button"
      onClick={() => history.push(0)} >
      Add
    </button>
    <ul>
      {history.value.map((val, i) =>
      <li key={i}>
        <OccupancyField {...history.at(i)}
          onRemove={() => history.remove(i)} />
       </li>)}
    </ul>
  </div>
}
