import React from 'react';
import FormWrapper from '../../../src';
import Immutable, { Map } from 'immutable';

const types = ["text", "color", "date", "datetime-local", "email", "file",
  "month", "number", "password", "search", "tel", "time", "url", "week", "range"];

const styles = {
  inputContainer: { margin: '2em' }
}

function MyForm ({ submitHandler, resetHandler, field, value }) {
  return (
    <form onSubmit={ submitHandler } onReset={ resetHandler }>

      {types.map((type, i) => (
      <div key={ i } style={ styles.inputContainer }>
        <input { ...field(type, { type }) } type={type} placeholder={ type } />
      </div>
      ))}

      <div style={ styles.inputContainer }>
        <label>a <input {...field('radio', { type: 'radio', value: 'a' } )} /></label>
        <label>b <input {...field('radio', { type: 'radio', value: 'b' } )} /></label>
      </div>

      <div style={ styles.inputContainer }>
        <label>checkbox <input {...field('checkbox', {type: 'checkbox'})} /></label>
      </div>

      <button type="submit">Submit</button>
      <button type="reset">Reset</button>

    </form>
  );
}

export default FormWrapper()(MyForm);
