import Immutable, {List, Map} from 'immutable';
import { map, last, isObject, isArray, isUndefined, isNil } from 'lodash';

export function flattenPath(path) {
  return map(path, item => Array.isArray(item) ? item[0] : item);
}

export function createPathObjects(state, path) {
  let i = 0, key, isArr, value, setPath = [];
  for (; i < path.length - 1; i++) {
    isArr = isArray(path[i]);
    key = isArr ? path[i][0] : path[i];
    setPath[i] = key;
    if (isNil(state.getIn(setPath))) {
      state = state.setIn(setPath, isArr ? new List() : new Map());
    }
  }
  return state;
}

export function update (state, { op, path, value }) {
  state = createPathObjects(state, path);
  path = flattenPath(path);
  if (isArray(value)) {
    value = List(value);
  } else if (value.constructor === Object) {
    value = Map(value);
  }
  switch(op) {
    case 'replace':
      return state.updateIn(path, () => value);
    case 'add':
      return state.updateIn(path, List(), (list) => list.push(value));
    case 'remove':
      return _.isUndefined(value)
        ? state.deleteIn(path)
        : state.updateIn(path, List(), (list) => list.delete(list.indexOf(value)));
    default:
      return state;
  }
}

export function buildPatchFromEvent(evt, path) {
  let { type, value, checked } = evt.target;
  switch(type) {
    case 'checkbox':
      return isArray(last(path))
        ? { op: checked ? 'add' : 'remove', path, value }
        : { op: 'replace', path, value: checked };
    case 'select-multiple':
      value = map(evt.target.querySelectorAll('option:checked'), 'value');
      return { op: 'replace', path, value };
    case 'number':
      return { path, op: 'replace', value: parseInt(value, 10) };
    default:
      return { path, op: 'replace', value };
  }
}

// JSON PATCH Examples
// [
//    { "op": "test", "path": "/a/b/c", "value": "foo" },
//    { "op": "remove", "path": "/a/b/c" },
//    { "op": "add", "path": "/a/b/c", "value": [ "foo", "bar" ] },
//    { "op": "replace", "path": "/a/b/c", "value": 42 },
//    { "op": "move", "from": "/a/b/c", "path": "/a/b/d" },
//    { "op": "copy", "from": "/a/b/d", "path": "/a/b/e" }
//  ]
