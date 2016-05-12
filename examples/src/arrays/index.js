import React from 'react';
import FormWrapper from '../../form-wrapper';
import Profile from './Profile';
import OccupancyHistory from './OccupancyHistory';


function MyForm ({ onSubmit, onReset, field, getName, tourOptions }) {

  return <form { ...{ onSubmit, onReset } } >

    <div>
      <h3>Tours</h3>
      {/* The value of a select field with multiple = true has to be an array.
      Form Wrapper is using the multiple prop passed in to set toJS to true in options.
      Alternative: <select field('tours[]', {}, { toJS: true }) multiple= true /> */}
      <select { ...field('tours[]', { multiple: true }) } >
        {tourOptions.map((item, i) =>
        <option key={i} value={item}>{item}</option>)}
      </select>
    </div>

    <OccupancyHistory history={ field('occupancyHistory[]') } />

    <Profile { ...field('profile') } />

    <div style={{marginTop: 30}}>
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </div>

  </form>;
}

export default FormWrapper()(MyForm);
