import Immutable, {List, Map} from 'immutable';
import { map, last, isArray, isNil, flatten, filter } from 'lodash';



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
  path = flatten(path);
  if (op !== 'remove' && !isNil(value)) {
    if (isArray(value)) {
      value = List(value);
    } else if (value.constructor === Object) {
      value = Map(value);
    }
  }
  switch(op) {
    case 'replace':
      return state.updateIn(path, () => value);
    case 'add':
      return state.updateIn(path, List(), list => list.push(value));
    case 'remove':
      return isNil(value)
        ? state.deleteIn(path)
        : state.updateIn(path, List(), list => list.delete(list.indexOf(value)));
    default:
      return state;
  }
}

export function buildPatchFromEvent(evt, field) {
  let { type, value, checked } = evt.target;
  const { path } = field;
  switch(type) {
    case 'checkbox':
      return field.isArray
        ? { op: checked ? 'add' : 'remove', path, value }
        : { op: 'replace', path, value: checked };
    case 'select-multiple':
      // value = evt.target.options.filter(o => o.selected).map(o => o.value);
      value = map( filter(evt.target.options, 'selected'), 'value');
      return { op: 'replace', path, value };
    case 'number':
      return { path, op: 'replace', value: parseInt(value, 10) };
    default:
      return { path, op: 'replace', value };
  }
}

export function buildName(parentName, childName, delimiter) {
  return parentName ? `${parentName}${delimiter}${childName}` : childName;
}


export const PATH_ARRAY_RE = /\[([\d]*)\]/;

export function buildPath(name, delimiter) {
  const delimited = name.split(delimiter);
  const path = [];
  for (let i = 0; i < delimited.length; i++) {
    let match = PATH_ARRAY_RE.exec(delimited[i]);
    if (!match) {
      path.push(delimited[i]);
      continue;
    }
    path.push([ delimited[i].slice(0, match.index) ]);
    if (match[1]) {
      path.push(match[1]);
    }
  }
  return path;
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
