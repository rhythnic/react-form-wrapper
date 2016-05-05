# Array Fields

* [getField().push](#getFieldPush)
* [getField().remove](#getFieldRemove)


You can indicate to Form Wrapper that a field is an array by using brackets in the field name.
All these are accepted:

```
getField('myArrayProp[]')
getField('myArrayProp[0]')
getField('myArrayProp[].0')
```

Going forward, when we talk about array fields, we mean the property that is an array, and not an index of
the array.  So, in the example directly above, the first one is an array ('myArrayProp[]').

The value of an array field will be an Immutable.js List, unless you pass the toJS option.
If the property is undefined in the form values Map, the value will be an empty List
(or array if you used toJS), rather than undefined.  So there's no need to check if the array field is undefined.

### <a name="getFieldPush"></a>getField().push

When you call getField for an array field, the result will have two array methods, push and remove.

```
const myArrayField = getField('myArrayField[]');
const default = 0;
...
<button type="button" onClick={ () => myArrayField.add(default) }>Add Item</button>
```

### <a name="getFieldRemove"></a>getField().remove

```
const myArrayField = getField('myArrayField[]');
const default = 0;
...
{ myArrayField.value.map((item, i) => (
  <div key={i}>
    <button type="button" onClick={() => myArrayField.remove(i) }>Remove item</button>
    ...
  </div>  
))}
```
