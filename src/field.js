import assign from 'lodash/assign';
import flatten from 'lodash/flatten';
import { buildPath } from './utils';
import { modifyPatchWithEvent, buildPatch } from './patch';


export default function buildField(name, childName, parent) {
  const { delimiter } = parent.props;
  const path = buildPath(delimiter, name);
  const flatPath = flatten(path);
  const isArray = Array.isArray( path[ path.length - 1 ] );


  const field = Object.defineProperties({}, {
    name:      { value: name, enumerable: true },
    childName: { value: childName },
    parent:    { value: parent },
    path:      { value: path },
    flatPath: { value: flatPath },
    pathToGetValue: { value: flatten( buildPath(delimiter, childName) ) },
    isArray:   { value: isArray },
    onChange:  { value: parent.onChange, enumerable: true },
    value:     {
      get() { return getValue(this); },
      enumerable: true,
      configurable: true
    },
    at: {
      value: function at(name, ...other) {
        return this.parent.getField(`${this.childName}${delimiter}${name}`, ...other);
      }
    },
    patch: {
      value: function () {
        const patch = buildPatch(path, flatPath);
        return modifyPatchWithEvent(isArray)(patch);
      }()
    }
  });

  if (field.isArray) {
    Object.defineProperties(field, {
      push:   { value: pushHandlerFactory(field)   },
      remove: { value: removeHandlerFactory(field) }
    });
  }

  return field;
}


export function extendField(field, opts) {
  opts  = opts  || {};

  if (typeof opts.type === 'string') {
    switch(opts.type.toLowerCase()) {
      case 'fieldset':
        return setFieldsetProperties(field);
      case 'file':
        return setFileFieldProperties(field);
      case 'color':
        return setColorFieldProperties(field, opts);
      case 'radio':
        return assign({}, field, { checked: opts.value === field.value, value: opts.value, type: opts.type });
      case 'checkbox':
        return field.isArray
          ? assign({}, field, { checked: field.value.indexOf(opts.value) > -1, value: opts.value, type: opts.type })
          : setBooleanCheckboxFieldProperties(field)
    }
  }

  if (opts.toJS) {
    return assign(
      {},
      field,
      { value: getValue(field, true) }
    );
  }

  return field;
}


export function setAlteredByTypeProp(field) {
  return Object.defineProperty(field, 'isAlteredByType', {
    value: true, writable: true
  })
}


export function setFieldsetProperties(field) {
  return setAlteredByTypeProp(Object.defineProperties(field, {
    version: {
      get() { return this.parent.state.version || this.parent.props.version || 0; },
      enumerable: true
    },
    delimiter: {
      get() { return this.parent.props.delimiter; },
      enumerable: true
    }
  }));
}


export function setFileFieldProperties(field) {
  return setAlteredByTypeProp(Object.defineProperties(field, {
    key: {
      get() { return `${this.name}_${this.version}`; },
      enumerable: true
    },
    value: {
      value: undefined,
      enumerable: true
    },
    type: {
      value: 'file',
      enumerable: true
    }
  }));
}


export function setColorFieldProperties(field, opts) {
  const initialColor = opts.initialColor || '#000000';
  return setAlteredByTypeProp(Object.defineProperties(field, {
    value: {
      get() { return getValue(this) || initialColor; },
      enumerable: true
    },
    type: {
      value: 'color',
      enumerable: true
    }
  }));
}


export function setBooleanCheckboxFieldProperties(field) {
  return setAlteredByTypeProp(Object.defineProperties(field, {
    checked: {
      get() { return !!getValue(this); },
      enumerable: true
    },
    value: {
      value: '',
      enumerable: true
    },
    type: {
      value: 'checkbox',
      enumerable: true
    }
  }));
}


function pushHandlerFactory({path, flatPath}) {
  const patch = Object.defineProperty(buildPatch(path, flatPath), 'op', { value: 'add', enumerable: true });
  return function push(value) {
    patch.value = value;
    this.onChange(patch);
  };
}


function removeHandlerFactory({ path, flatPath }) {
  const patch = Object.defineProperties({}, {
    path: { value: path },
    op: { value: 'remove', enumerable: true },
    isPatch: { value: true }
  });
  return function remove(index) {
    patch.flatPath = [...flatPath, index];
    this.onChange(patch);
  };
}


export function getValue(field, toJS) {
  const ctx = field.parent.state.value || field.parent.props.value;
  return field.parent.immutable.getValue(field, toJS, ctx);
}
