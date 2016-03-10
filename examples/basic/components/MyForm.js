import React from 'react';
import FormWrapper from '../../../src';


const Profile = FormWrapper()(function ({ getField, getValue, getName }) {
  const features = getValue('features');
  return <div>
    <input placeholder="name" {...getField('name')}/>
    <p>Features</p>
    <label>Hot Water
      <input {...getField('features')}
        checked={features && features.includes('hot water')}
        type="checkbox"
        value="hot water"
        data-type="array" />
    </label>
    <label>Cable
      <input {...getField('features')}
        checked={features && features.includes('cable')}
        type="checkbox"
        value="cable"
        data-type="array" />
    </label>
    { /* multiple-select example for features
    <select multiple={true} {...getField('features', {toJS: true})} >
      {['hot water', 'cable'].map((item, i) =>
      <option key={i} value={item}>{item}</option>)}
    </select>
    */}
  </div>
});

const Address = FormWrapper()(function ({ getField }) {
  return <div>
    <p>Address</p>
    <input placeholder="street" {...getField('street')}/>
    <label>Vacancy
      <input type="checkbox" {...getField('vacancy')} />
    </label>
  </div>
});

function MyForm ({ onSubmit, onReset, getField }) {
  return <form onSubmit={onSubmit} onReset={onReset}>
    <Profile {...getField('profile')} />
    <Address {...getField('address')} />
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </form>;
}

export default FormWrapper()(MyForm);
