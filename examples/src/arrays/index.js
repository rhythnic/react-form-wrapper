import React from 'react';
import FormWrapper from '../../../src';
import Profile from './Profile';
import OccupancyHistory from './OccupancyHistory';


function MyForm ({ submitHandler, resetHandler, field, tourOptions }) {

  return (
    <form onSubmit={ submitHandler } onReset={ resetHandler }>

      <div>
        <h3>Tours</h3>
        <select { ...field('tours[]', { toJS: true }) } multiple={true}>
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

    </form>
  );
}

export default FormWrapper()(MyForm);
