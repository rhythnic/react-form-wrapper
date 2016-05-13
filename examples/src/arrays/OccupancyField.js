import React from 'react';

export default function OccupancyField({ name, value, onChange, onRemove }) {
  return <div>
    <input {...{name, value, onChange}} placeholder="0" type="number" />
    <button type="button" onClick={onRemove}>remove</button>
  </div>;
}
