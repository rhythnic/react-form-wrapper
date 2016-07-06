import React from 'react';
import FormWrapper from '../../../src';

function Profile({ field }) {
  const features = field('features[]');
  return (
    <div>
      <input {...field('name')} placeholder="Name" />
      <p>Hotel Features</p>
      <ul>
        {['cable', 'hot water', 'sun chairs'].map((item, i) => <li key={i}>
          <span>{item}</span>
          <input {...field('features[]', { type: 'checkbox', value: item }) } />
        </li>)}
      </ul>
    </div>
  );
}

export default FormWrapper()(Profile);
