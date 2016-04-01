import React from 'react';
import FormWrapper from '../form-wrapper';
import Profile from './Profile';
import OccupancyHistory from './OccupancyHistory';


function MyForm ({ onSubmit, onReset, getField, getName, tourOptions }) {

  return <form { ...{ onSubmit, onReset } } >

    <div>
      <h3>Tours</h3>
      <select { ...getField('tours[]') } multiple={true}>
        {tourOptions.map((item, i) =>
        <option key={i} value={item}>{item}</option>)}
      </select>
    </div>

    <OccupancyHistory { ...getField('occupancyHistory[]') } />

    <Profile {...getField('profile')} />

    <div style={{marginTop: 30}}>
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </div>

  </form>;
}

export default FormWrapper()(MyForm);
