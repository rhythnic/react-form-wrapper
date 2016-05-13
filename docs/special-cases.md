# Special Cases

* [File Inputs](#file-inputs)
* [Next: Custom Inputs](./custom-inputs.md)

## File Inputs

Controlling file inputs in React requires you to do two things:

1.  Don't pass a value prop to the file input
2.  Pass a key prop to the input, which is changed when the form needs to be reset

FormWrapper takes care of this for you, but you have to indicate that the field is a file input.

```
<input { ...field('myProp', { type: 'file' }) } />
```

* [Next: Custom Inputs](./custom-inputs.md)
