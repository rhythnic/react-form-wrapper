# Custom Inputs

When calling onChange for custom inputs, pass a JSON patch object.


```
class CustomInput extends Component {
  
  myChangeHandler(value) {
    const { onChange, name } = this.props;
    const patch = { op: 'replace', path: name, value };
    onChange(patch);
  }

  render() {
    ...
  }
}
```
