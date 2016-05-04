# getName

* [API for getName](#API)
* [Next: getValue](./get-value.md)


The input name attribute uses JS property access notation to describe the location of a
property inside of the final payload.

```
<input name="profile.name" />
```

Because we're using JS property access notation, we don't need to declare a schema.
getName constructs the name by appending this node's name to the name of the most immediate Form Wrapper.
If there were a fieldset Profile, which had the name 'profile', then within profile,
calling getName('name') will result in the string 'profile.name'.

```
// inside of Profile.js
<input { ...getName('name') } />
// evaluates to
<input name="profile.name" />
```

* [Next: getValue](./get-value.md)


## <a name="API"></a>getName API

#### getField ( name )

* name is a string that is in JS object property notation
* name refers to the path of this value within the value of the most immediate Form Wrapper
