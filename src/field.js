import assign from 'lodash/assign';
import flatten from 'lodash/flatten';
import { buildPath, getValue } from './pure-functions';


export default function buildField(name, childName, parent) {
  const path = buildPath(name, parent._delimiter);

  const field = Object.defineProperties({}, {
    name:      { value: name, enumerable: true },
    childName: { value: childName },
    parent:    { value: parent },
    path:      { value: path },
    valuePath: { value: flatten( buildPath(childName, parent._delimiter) ) },
    isArray:   { value: Array.isArray( path[ path.length - 1 ] ) },
    onChange:  { value: parent.changeHandler, enumerable: true },
    value:     {
      get() {
        return getValue(this);
      },
      enumerable: true
    },
    version: {
      get() {
        return this.parent.state.version || this.parent.props.version || 0;
      },
      // TODO: version only enumerable when passed to fieldset
      enumerable: true
    },
    at: {
      value: function at(name, ...other) {
        return this.parent.getField(`${this.childName}${this.parent._delimiter}${name}`, ...other);
      }
    }
  });

  if (field.isArray) {
    Object.defineProperties(field, {
      push: {
        value: function push(value) {
          return this.onChange({ op: 'add', path: this.path, value })
        }
      },
      remove: {
        value: function remove(index) {
          return this.onChange({ op: 'remove', path: [...this.path, index] });
        }
      }
    });
  } else {
    // TODO: better strategy for checked prop
    Object.defineProperty(field, 'checked', {
      get() {
        const val = this.value;
        return typeof val === 'boolean' ? val : (val != null);
      },
      enumerable: true
    })
  }

  return field;
}


export function extendField(field, props, opts) {
  props = props || {};
  opts  = opts  || {};

  if (typeof props.type === 'string' && props.type.toLowerCase() === 'file') {
    return assign(
      {},
      field,
      {
        value: undefined,
        key: `${field.name}_${field.version}`,
      },
      props
    );
  }

  if (opts.toJS) {
    return assign(
      {},
      field,
      { value: getValue(field, true) },
      props
    );
  }

  return assign({}, field, props);
}
