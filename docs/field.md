# field

* [API for field](#API)
* [field().at](#fieldAt)
* [Next: Array Fields](./array-fields.md)


The field method returns an instance of the class Field.  Field's enumerable properties
are passed as the props object to your input.  This props object always
contains name, value, and onChange.  onChange is the same for all fields inside
of a wrapped component.

**Within a fieldset with the name 'address'**
```
<input { ...field('street') } />

// is the same as:

<input
  name="address.street"
  value="123 Main St."
  onChange={ onChange } />
```

The name of an input is JS property access notation for that property within the outermost
data structure ( form values object );

The second argument of field is a props object.  This extends the properties that
are returned by field.

```
<input { ...field('street', { placeholder: 'Street'} ) } />
```

You can also put it outside, as usual.

```
<input { ...field('street') } placeholder="Street" />
```

The third argument of field is an options object.  Currently, the only option is 'toJS'.
FormWrapper uses [Immutable.js](https://facebook.github.io/immutable-js/) to maintain
form values.  toJS is part of the Immutable.js API. It enables you to receive a JS object when you would otherwise get a Map or a List.

```
<input { ...field('myArrayField', null, { toJS: true } )} />
```

Immutable Lists support map and forEach, as if they were arrays.  You only really
need toJS if you're passing the value to a component that expects an array, like
the "select" component when multiple set to "true".


### <a name="fieldAt"></a>field().at

'at' is a method of Field.  It allows you to easily call field for nested values.
Calling field('address').at('street') is the same as calling field('address.street');

```
const myArrayProp = field('myArrayProp[]');
{ myArrayProp.value.map(item => <input { ...myArrayProp.at(0) } />) }
```

* [Next: Array Fields](./array-fields.md)


## <a name="API"></a>field API

#### field ( name [ , props,  options ] )

* name is a string that is in JS object property notation
* name refers to the path of this value within the value of the most immediate Form Wrapper

options and defaults
```
{
  toJS: false
}
```
