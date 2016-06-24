import React from 'react';
import FormWrapper from '../../form-wrapper';
import Immutable, { Map } from 'immutable';

const types = ["text", "color", "date", "datetime-local", "email", "file",
  "month", "number", "password", "search", "tel", "time", "url", "week", "range"];

const styles = {
  inputContainer: { margin: '2em' }
}

function MyForm ({ onSubmit, field }) {
  return (
    <form { ...{ onSubmit } }>

      {types.map((type, i) => (
        <div key={ i } style={ styles.inputContainer }>
          <input { ...field(type, { type }) } placeholder={ type } />
        </div>
      ))}

      <div style={ styles.inputContainer }>
        <label>a <input {...field('radio', { type: 'radio', value: 'a' } )} /></label>
        <label>b <input {...field('radio', { type: 'radio', value: 'b' } )} /></label>
      </div>

      <div style={ styles.inputContainer }>
        <label>checkbox <input {...field('checkbox')} type="checkbox"/></label>
      </div>

      <button type="submit">Submit</button>
      <button type="reset">Reset</button>

    </form>
  );
}

export default FormWrapper()(MyForm);
