## Synopsis

React Form Wrapper is a higher-order component for wrapping form components and
custom components within your forms.  The API seeks to copy that of an input
element, so you can intuitively compose forms into smaller groups of inputs.

## NOTICE

This library is in it's early stages.  It doesn't currently have any tests and
hasn't been applied to a wide array of use cases.  Use at your own risk.
Help wanted.

## Code Example

```
import React from 'react';
import {render} from 'react-dom';
import FormWrapper from 'react-form-wrapper';

const Profile = FormWrapper()(function ({ getField }) {
  return <div>
    <input placeholder="name" {...getField('name')}/>
    <select {...getField('species')} >
      {['human', 'cat', 'monkey'].map((item, i) =>
      <option key={i} value={item}>{item}</option> )}
    </select>
  </div>
});

const MyForm = FormWrapper()(function ({ onSubmit, onReset, getField }) {
  return <form onSubmit={onSubmit} onReset={onReset}>
    <input {...getField('job.title')} placeholder="job" />
    <Profile {...getField('profile')}/>
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </form>;
}

render(
  <MyForm onSubmit={(data) => console.log(data)}) />,
  document.getElementById('root') );

// result of console.log
// {
//   job: {
//     title: 'string'
//   },
//   profile: {
//     name: 'string',
//     species: 'string'
//   }
// }
```

Two things make React Form Wrapper very easy to use with Redux.
  1) If a form receives an onChange property, it will not attempt to keep state internally
  2) If a form receives a new value, it will update to that new value.

```
import React from 'react';
import MyWrappedForm from './my-wrapped-form';

function MyComponent({ onChange, onSubmit, value }) {
  return <MyWrappedForm {...{ onChange, onSubmit, value }} />
}

function mapStateToProps(state) {
  return {
    value: state.path.to.my.form };
}

const mapDispatchToProps = {
  onChange: ([name, value, active]) => ({type: 'MY_WRAPPED_FORM_CHANGE', name, value, active}),
  onSubmit: (event) => ({type: 'MY_WRAPPED_FORM_SUBMIT', event})
}

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
```

## Motivation

The aim of this package is to be/have:
*  Easy to use without having to declare a schema
*  Performant (immutable.js and pure-render-mixin used internally)
*  Use with or without Redux
*  Data management only, no custom components
*  JSON schema support (future version)
*  Forms composed of other forms
*  Intuitive API, predictable behavior

## Installation

npm install --save react-form-wrapper

## API Reference

Form Wrapper propTypes:
* name
  * path to value inside of the parent's value property
  * can be an array or a delimited string
* value
* delimiter
  * delimiter character used in name prop, defaults to '.'
* onSubmit
  * if onChange also passed as prop, onSubmit will return the submit event
  * if onChange not passed as prop, onSubmit will return a JS object for the data
* onReset
  * resets the form's value to the most recently received value prop
* onChange
  * function to call with updated values

Props passed to wrapped component:
  * value
  * onSubmit & onReset
    * pass to form element
  * onChange
  * getValue
    * uses immutablejs 'getIn' to get the nested value by path
    * also looks out for undefined
  * getField
    * convenience function that bundles the onChange, value(from getValue), and name props


To help clarify how nested forms work, let's rewrite the example above without using 'getField'.

```
const Profile = FormWrapper()(function ({ getValue, onChange }) {
  return <div>
    <input placeholder="name" name="name" onChange={onChange} value={getValue('name')} />
    <select name="species" onChange={onChange} value={getValue('species')} >
      {['human', 'cat', 'monkey'].map((item, i) =>
      <option key={i} value={item}>{item}</option> )}
    </select>
  </div>
});

const MyForm = FormWrapper()(function ({ onSubmit, onReset, onChange, getValue }) {
  return <form onSubmit={onSubmit} onReset={onReset}>
    <input placeholder="job" name="job.title" value={getValue('job.title')} onChange={onChange}/>
    <Profile name="profile" value={getValue('profile')} onChange={onChange} />
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </form>;
}
```

Profile isn't maintaining any state, just forwarding all changes up to MyForm.  Before
Profile forwards the changes, it adds it's 'name' property to the beginning of the
input's name property, so a change to "species" is forwarded up from Profile as ["profile", "species"].
Once MyForm receives the change, it has the full path of where to update the value.
Since the value in MyForm is an immutable.js object,
updates are easily done using the path, using the 'updateIn' method.

Likewise, when passing the value down, only the "profile" portion of the value is passed to Profile.
If you type in the job input field, Profile will not re-render, because it's value
isn't changing.

Because the values are immutable.js objects, and can sometimes be undefined, using the 'getValue'
method that React Form Wrapper provides is a convenient way to access the value.

getValue and getField accept a second parameter, an object of options, to which you can pass toJS: true.
This will get you the JS value and not the immutable.js equivalent.

Better documentation to come.


### TODO
  * testing
  * documentation
  * validation
  * JSON Schema support

## Contributors

If you would like to contribute, please first open a new issue for discussing.
