# Wrapping Components

* [API for wrapping components](#API)
* [Next: field](./get-field.md)


##### Data structure
For our examples, we'll be working with this simple structure.

```
{
  profile: {
    name: 'Jane'
  }
}
```

##### Nested Fieldset (Profile)
We'll be using the term fieldset to refer to one Form Wrapper instance inside of another
Form Wrapper instance.  Fieldset could be any tag (div).

```
import FormWrapper from 'react-form-wrapper';

function Profile({ field }) {
  return (
    <fieldset>
      <input { ...field('name') } />
    </fieldset>
  );
}

const opts = {}; // optional configuration object

export default FormWrapper(opts)(Profile)

```

##### Form

```
import FormWrapper from 'react-form-wrapper';
import Profile from './Profile';

function UserForm({ onSubmit, onReset, field }) {
  return (
    <form onSubmit={ onSubmit }>
      <Profile { ...field('profile') } />
    </form>
  );
}

export default FormWrapper()(UserForm)

```

##### Parent Component

```
import UserForm from '../components/UserForm';

export default class UserEdit extends Component {
  submitHandler(data) {
    // data is JS object
  }
  render() {
    return (
        <UserForm onSubmit={ submitHandler.bind(this) } />
    )
  }
}
```

* [Next: field method](./field.md)


## <a name="API"></a>Form Wrapper API

#### FormWrapper( [ options ] )( Component )

Options and default values
```
{
  delimiter: '.'
}
```

The options object will be used more as Form Wrapper supports validation and more features.


#### Props accepted by Form Wrapper instance

- **onSubmit**
  * callback for when form is submitted
- **value**
  * JS object
  * if onChange prop used, form acts as a controlled input (won't keep state)
  * in onChange prop not used, value acts as defaultValue; however, if value changes,
    form values will reset to match those values.
- **name**
  * for fieldsets, which receive a name and a value, name is the the path to that value
  * JS property access notation
- **onChange**
  * callback for when a form value has changed
  * callback receives a JSON patch object
  * onChange callback prevents Form Wrapper from saving state internally
  * used for fieldsets or maintaining form state outside of FormWrapper
- **onReset**
  * receives form's reset event


#### Methods available on a Form Wrapper instance

- **getValue( [ options ] )**
  * get form data, as a JS object
  * pass { toJS: false } in options to receive the Immutable.js Map


#### Props available inside a wrapped component

-  value - value of FormWrapper's state or props
-  onSubmit & onReset
  * callbacks to pass to the form element
-  onChange
  * callback to pass to input elements
-  [field(name [, props, options ] )]('./field')
-  [field(name [, props, options ] )]('./get-field') deprecated
-  [getName(name)](./get-name.md) deprecated
-  [getValue(name)](./get-value.md) deprecated
