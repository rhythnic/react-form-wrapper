# Custom Inputs

When calling the onChange callback for custom inputs, you should pass a JSON patch
object to the onChange callback.


## Using JSON patch

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
