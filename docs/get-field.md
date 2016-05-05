# getField

* [API for getField](#API)
* [getField().at](#getFieldAt)
* [Next: getName](./get-name.md)


getField returns a props object to pass to your input.  This props object always
contains name, value, and onChange.  For name, it uses getName.  For value, it uses
getValue.  onChange is the same for all fields inside of a wrapped component.

```
<Profile { ...getField('profile') } />

// is the same as:

<Profile
  name={ getName('profile') }
  value={ getValue('profile') }
  onChange={ onChange } />
```

The second argument of getField is a props object.  This extends the properties that
are returned by getField.

```
<input { ...getField('prop', { placeholder: 'My Prop'} ) } />
```

The props argument can be used to help configure the result of getField.
We'll see an example of this in getValue.

The third argument of getField is an options object.  Currently, the only option is 'toJS'.
Read more about the toJS option in [getValue](./get-value.md).

```
<input { ...getField('prop', null, { toJS: true } )} />
```


### <a name="getFieldAt"></a>getField().at

The 'at' method is always available on the result of getField.  It allows you to easily call getField for nested values.
Calling getField('prop').at('subprop') is the same as calling getField('prop.subprop');

```
const myArrayProp = getField('myArrayProp[]');
{ myArrayProp.value.map(item => <input { ...myArrayProp.at(0) } />) }
```


* [Next: getName](./get-name.md)


## <a name="API"></a>getField API

#### getField ( name [ , props,  options ] )

* name is a string that is in JS object property notation
* name refers to the path of this value within the value of the most immediate Form Wrapper

options and defaults
```
{
  toJS: false // true if props contains multiple:true
}
```
