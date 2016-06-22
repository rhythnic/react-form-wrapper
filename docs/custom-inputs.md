# Custom Inputs

You might need to map property names, from what Form Wrapper expects and what
a custom input exposes through its API.  In most cases, you can save the result
of calling the field method to a variable and then access the properties.

```
const myProp = field('myProp');

<CustomInput { ...myProp } customOnChange={ myProp.onChange } />
```


If a custom input doesn't pass an event as the first argument to the change handler,
you need to wrap the input and convert the argument to a JSON patch.
```
class CustomInputWrapper extends Component {

  myChangeHandler(value) {
    const { onChange, name } = this.props;
    const patch = { op: 'replace', path: name, value };
    onChange(patch);
  }

  render() {
    <CustomInput {...this.props} onChange={this.myChangeHandler.bind(this)} />
  }
}
```
