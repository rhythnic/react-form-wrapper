import React from 'react';
import FormWrapper from '../../form-wrapper';

function Profile({ field }) {
  const features = field('features[]');
  return (
    <div>
      <input {...field('name')} placeholder="Name" />
      <p>Hotel Features</p>
      <ul>
        {['cable', 'hot water', 'sun chairs'].map((item, i) => <li key={i}>
          <span>{item}</span>
          <input {...features} type="checkbox" value={item}
            checked={features.value.includes(item)} />
        </li>)}
      </ul>
    </div>
  );
}

export default FormWrapper()(Profile);
