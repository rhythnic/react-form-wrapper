## Synopsis

React Form Wrapper is a higher-order component for wrapping forms and fieldsets.
The API seeks to copy that of an input element, so you can intuitively compose
forms into smaller groups of inputs.


## NOTICE

This module is being published prematurely as a means of potentially getting
feedback to improve the API.  It's possible that the API might change slightly.
Use at your own risk.  There aren't currently many tests.


## How it works

### Nesting wrapped components

*  Form wrapper is used to wrap your forms and fieldsets
*  If a wrapped component receives the onChange property:
  * form values are not maintained in that component
  * all changes are forwarded upwards as JSON patch objects
  * e.g. { op: 'replace', path: ['name'], value: 'Bob' }
*  Form values can be maintained manually by passing the onChange and value props
   to your forms.
*  Form Wrapper will maintain your form values for you if you don't pass 'onChange'
   to the form.


### Names

Input names need to contain the full path to the value being updated.

Path syntax:
```
<input name="profile.features[0].title" />
// same as
<input name="profile.features[].0.title" />
```

Because forms are organized into fieldsets, you usually don't have to type
the whole name, but the end result needs to be the same.  Form Wrapper offers a
method 'getName' to make it easier.

The input names implicitly describe the data structure, so declaring a Schema
is optional.  (Actually it's not even supported yet.  JSON schema will be supported
in the future. )


## Aim

The aim of this package is to be/have:

*  Easy to use without having to declare a schema
*  Performant (immutable.js and pure-render-mixin used internally)
*  Use with or without Redux
*  Data management only, no custom components
*  JSON schema support (future)
*  Forms composed of other forms
*  Intuitive API, predictable behavior


## Examples

Please see the [examples folder](./examples/basic/index.js)

To run the examples

```
(clone repo)
npm install
npm start
// localhost:8080
// submitting a form will print the values to the console
```

## Installation

npm install --save react-form-wrapper


## API Reference

**Options passed while wrapping a component**

* delimiter: String
  * delimiter used in name; defaults to '.'

```
export default FormWrapper({ delimiter: '/' })(MyForm);
```

**PropTypes accepted by a wrapped component:**

* name: String
  * path to value
* value: Object
* onSubmit: Function
  * if onChange also passed as prop, onSubmit will forward the submit event
  * if onChange not passed as prop, onSubmit will return a JS object
* onReset: Function
  * forwards reset event
* onChange: Function
  * handler for input change events
  * receives a JSON patch object

**Methods available on a wrapped component:**

* getValue
  * get form data structure, as a JS object
  * pass { toJS: false } as the first param to receive the Immutable.js Map


**Props available inside a wrapped component:**

  * value - value that is maintained by Form Wrapper or was passed to Form Wrapper
  * onSubmit & onReset
    * pass to form element
  * onChange
    * pass to nested forms and input elements
  * getName(name)
    * appends name to name of wrapped parent component, using the delimiter
  * getValue(name)
    * get value of name within the value received by parent form-wrapper
  * getField(name, props, options)
    * convenience function that bundles onChange, value(from getValue), and name(from getName)
    * any props returned by getField are overwritten by the props passed to getField
    * pass { toJS: true } in options to convert Immutable.js Map to {} or List to []

**getField result methods**

  * at
    * getField('user').at('profile') is the same as getField('user.profile')
  * Array methods, when getField is called on an array field
    * push(item)
    * remove(index)

## Tips

* Organize your forms by nesting wrapped components for greater efficiency
  * uses pure-render-mixin


### TODO
  * testing
  * validation
  * JSON Schema support
  * documentation

## Contributors

If you would like to contribute, please first open a new issue for discussing.
