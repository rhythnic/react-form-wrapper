import assign from 'lodash/assign';
import flatten from 'lodash/flatten';
import filter from 'lodash/filter';
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
    },
    patch: {
      value: function () {

        const _patch = buildPatch(path);

        return function patch(evt) {
          const { value, checked, type } = evt.target;
          _patch.op = 'replace';

          switch(evt.target.type) {
            case 'checkbox':
              if (this.isArray) {
                _patch.op = checked ? 'add' : 'remove';
              } else {
                _patch.value = checked;
              }
              break;
            case 'select-multiple':
              _patch.value = filter(evt.target.options, 'selected').map(o => o.value);
              break;
            case 'number':
              _patch.value = parseInt(value, 10);
              break;
            case 'file':
              _patch.value = evt.target.files;
              break;
            default:
              _patch.value = value;
          }

          return _patch;
        }
      }()
    }
  });

  if (field.isArray) {
    Object.defineProperties(field, {
      push: {
        value: function() {
          const _patch = Object.defineProperty(buildPatch(path), 'op', { value: 'add', enumerable: true });
          return function push(value) {
            _patch.value = value;
            this.onChange(_patch);
          };
        }()
      },
      remove: {
        value: function() {
          const _patch = Object.defineProperties({}, {
            op: { value: 'remove', enumerable: true },
            isNormalized: { value: true }
          });
          return function remove(index) {
            _patch.path = [...path, index];
            this.onChange(_patch);
          };
        }()
      }
    });
  } else {
    // TODO: better strategy for checked prop
    // Depracate in favor of props option
    Object.defineProperty(field, 'checked', {
      get() {
        const val = this.value;
        return typeof val === 'boolean' ? val : (val !== '');
      },
      enumerable: true
    })
  }

  return field;
}


export function extendField(field, props, opts) {
  props = props || {};
  opts  = opts  || {};

  if (typeof props.type === 'string') {
    switch(props.type.toLowerCase()) {
      case 'file':
        return assign({}, field, { value: undefined, key: `${field.name}_${field.version}` }, props);
      case 'color':
        return assign({}, field, { value: field.value || '#000000' }, props);
      case 'radio':
        return assign({}, field, { checked: props.value === field.value }, props);
      case 'checkbox':
        return field.isArray
          ? assign({}, field, { checked: field.value.indexOf(props.value) > -1, value: '' }, props)
          : assign({}, field, { checked: !!field.value, value: '' }, props);
    }
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

function buildPatch(path) {
  return Object.defineProperties({}, {
    path:         { value: path, enumerable: true },
    isNormalized: { value: true }
  });
}
