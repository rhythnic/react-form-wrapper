## Synopsis

React Form Wrapper is a higher-order component for wrapping forms and fieldsets.
The API seeks to copy that of an input element, so you can intuitively compose
forms into smaller groups of inputs.

## Installation

npm install --save react-form-wrapper


## [Documentation](./docs)


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


## Tips

* Organize your forms by nesting wrapped components for greater efficiency
  * uses pure-render-mixin


## Aim

The aim of this package is to be/have:

*  Easy to use without having to declare a schema
*  Performant (immutable.js and pure-render-mixin used internally)
*  Use with or without Redux
*  Data management only, no custom components
*  JSON schema support (future)
*  Forms composed of other forms
*  Intuitive API, predictable behavior


### TODO
  * validation
  * JSON Schema support


## Contributors

If you would like to contribute, please first open a new issue for discussing.
