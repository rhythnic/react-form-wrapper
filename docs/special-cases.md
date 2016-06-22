# Special Cases

* [Checkboxes](#checkboxes)
* [Radio Buttons](#radio-buttons)
* [File Inputs](#file-inputs)
* [Color Inputs](#color-inputs)
* [Next: Custom Inputs](./custom-inputs.md)


The second param of the field method is a props object.  These props extend/overwrite
the field props.  In special cases, the field method can use these props to know which
type of input is being used and configure the result accordingly.


## <a name="checkboxes"></a>Checkboxes

Checkboxes indicate a boolean value or the inclusion of a value in an array.

Boolean
```
<input { ...field('myBool', { type: 'checkbox' }) } />
```

Array value
```
<input { ...field('myArray[]', { type: 'checkbox', value: 'arrayItem' }) } />
```

## <a name="radio-buttons"></a>Radio Buttons

```
<input { ...field('myProp', { type: 'radio', value: 'option1' }) } />
```


## <a name="file-inputs"></a>File Inputs

Controlling file inputs in React requires you to do two things:

1.  Don't pass a value prop to the file input
2.  Pass a key prop to the input, which is changed when the form needs to be reset

FormWrapper takes care of this for you, but you have to indicate that the field is a file input.

```
<input { ...field('myProp', { type: 'file' }) } />
```


## <a name="color-inputs"></a>Color Inputs

The default value in a controlled React input is an empty string.  The empty string
is an invalid value for a color input because the value should be in the hex color format ('#rrggbb').
For color inputs, Form Wrapper uses black as a default color in the event that the property
value is undefined.

```
<input { ...field('myProp', { type: 'color' }) } />
```


* [Next: Custom Inputs](./custom-inputs.md)
