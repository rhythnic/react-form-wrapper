# Array Fields

* [field().push](#fieldPush)
* [field().remove](#fieldRemove)
* [Next: Special Cases](./special-cases.md)


You can indicate to Form Wrapper that a field is an array by using brackets in the field name.

```
field('myArrayProp[]')
```


For an index of the array, both of these are accepted:

```
field('myArrayProp[0]')
field('myArrayProp[].0')
```

Going forward, when we talk about array fields, we mean the property that is an array, and not an index of the array.

The value of an array field will be an Immutable.js List, unless you pass the toJS option.
If the array field hasn't been set yet, and is undefined in the form values, the value will be an empty List (or array if you used toJS), rather than undefined.  There's no need to check if the array field is undefined.

### <a name="fieldPush"></a>field().push

Field has two methods for arrays, push and remove.

```
const myArrayField = field('myArrayField[]');
const default = 0;
...
<button type="button" onClick={ () => myArrayField.push(default) }>Add Item</button>
```

### <a name="fieldRemove"></a>field().remove

```
const myArrayField = field('myArrayField[]');
const default = 0;
...
{ myArrayField.value.map((item, i) => (
  <div key={i}>
    <button type="button" onClick={() => myArrayField.remove(i) }>Remove item</button>
    ...
  </div>  
))}
```

* [Next: Special Cases](./special-cases.md)
