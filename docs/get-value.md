# getValue

* [API for getValue]('#API')
* [Next: Array Fields]('./array-fields')


Form Wrapper uses [Immutable.js](https://facebook.github.io/immutable-js) to maintain the form values.
Similar to getName, getValue constructs the full JS property access notation string and then uses that
to get the value from within the Immutable.js Map.  Inside the Map, there are no objects or arrays.
There are only Maps and Lists.  To get the object or array, use the toJS option.

```
<select
  multiple={ true }
  name={ getName('prop') }
  value={ getValue('prop', { toJS: true } ) } >
```

You can also pass the toJS option to getFields

```
<select
  multiple={ true }
  { ...getField('prop', null, { toJS: true } ) } >
```

In this example, you can just pass multiple as a prop to getField.  getField will use this
to set toJS to true.

```
<select { ...getField('prop', { multiple: true }) } >
```

* [Next: Array Fields]('./array-fields')


## <a name="API"></a>getValue API

#### getValue( name [, options ] )

* name is a string that is in JS object property notation
* name refers to the path of this value within the value of the most immediate Form Wrapper

options and defaults
```
{
  toJS: false
}
```
