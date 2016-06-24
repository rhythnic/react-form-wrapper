import Immutable, {List, Map} from 'immutable';
import flatten from 'lodash/flatten';
import filter from 'lodash/filter';
import assign from 'lodash/assign';
import get from 'lodash/fp/get';
import getOr from 'lodash/fp/getOr';
import reduce from 'lodash/reduce';


export function createPathObjects(state, path) {
  const setPath = [];
  return path.slice(0, -1).reduce((state, key) => {
    const isArr = Array.isArray(key);
    setPath.push(isArr ? key[0] : key);
    return state.updateIn(setPath, x => x == null ? isArr ? List() : Map() : x);
  }, state);
}


export function update (state, { op, path, value }) {
  state = createPathObjects(state, path);
  path = flatten(path);
  if (value && op !== 'remove' && typeof value === 'object') {
    value = Immutable.fromJS(value);
  }
  switch(op) {
    case 'replace':
      return state.setIn(path, value);
    case 'add':
      return state.updateIn(path, List(), xs => xs.push(value));
    case 'remove':
      return value == null
        ? state.deleteIn(path)
        : state.updateIn(path, List(), xs => xs.delete(xs.indexOf(value)));
    default:
      return state;
  }
}


export function buildPatchFromEvent(evt, { path, isArray }) {
  let { type, value, checked } = evt.target;
  const op = 'replace';
  switch(type) {
    case 'checkbox':
      return isArray
        ? { path, op: checked ? 'add' : 'remove', value }
        : { path, op, value: checked };
    case 'select-multiple':
      return { path, op, value: filter(evt.target.options, 'selected').map(o => o.value) };
    case 'number':
      return { path, op, value: parseInt(value, 10) };
    case 'file':
      return { path, op, value: evt.target.files };
    default:
      return { path, op, value };
  }
}


export const buildPath = function() {
  const PATH_ARRAY_RE = /\[([\d]*)\]/;

  return function buildPath(name, delimiter) {
    return name.split(delimiter).reduce((path, key) => {
      let match = PATH_ARRAY_RE.exec(key);
      path.push(match ? [ key.slice(0, match.index) ] : key);
      if (match && match[1]) {
        path.push(match[1]);
      }
      return path;
    }, []);
  };

}();


export function getValue({ parent, isArray, valuePath }, toJS) {
  let value;
  const ctx = get('value')(parent.state) || get('value')(parent.props) || Map();
  if (typeof ctx === 'object' && typeof ctx.getIn === 'function') {
    value = ctx.getIn(valuePath) || value;
  }
  return toJS && typeof value === 'object' && typeof value.toJS === 'function'
    ? value.toJS()
    : value == null
      ? isArray ? List() : ''
      : value;
}


export const parseSchemaForFieldProps = function() {

  const propMap = {
    minimum: 'min',
    maximum: 'max'
  };

  const typeMap = {
    integer: {
      type: 'number',
      step: 1
    }
  }

  return function parseSchemaForFieldProps(rootSchema, schema) {
    schema = schema || rootSchema;

    const result = ['title', 'type']
      .filter(key => key in schema)
      .reduce((acc, key) => { acc[key] = schema[key];  return acc; }, {});

    result.fields = reduce(schema.properties, (acc, val, key) => {
      acc[key] = reduce(val, (acc, val, key) => {
        switch(key) {
        case '$ref':
          return assign(acc, parseSchemaForFieldProps(rootSchema, rootSchema.definitions[val.replace('#/definitions/', '')]))
        case 'type':
          return assign(acc, val in typeMap ? typeMap[val] : { type: val });
        default:
          return assign(acc, key in propMap ? { [propMap[key]]: val } : { [key]: val });
        }
      }, {});
      acc[key].required = getOr([])('required')(schema).indexOf(key) > -1;
      return acc;
    }, {});

    return result;
  }
}();
