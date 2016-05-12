import Immutable, {List, Map} from 'immutable';
import flatten from 'lodash/flatten';
import filter from 'lodash/filter';


export function createPathObjects(state, path) {
  let i = 0, key, isArr, value, setPath = [];
  for (; i < path.length - 1; i++) {
    isArr = Array.isArray(path[i]);
    key = isArr ? path[i][0] : path[i];
    setPath[i] = key;
    if (state.getIn(setPath) == null) {
      state = state.setIn(setPath, isArr ? new List() : new Map());
    }
  }
  return state;
}


export function update (state, { op, path, value }) {
  state = createPathObjects(state, path);
  path = flatten(path);
  if (op !== 'remove' && value != null) {
    if (Array.isArray(value)) {
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
      return value == null
        ? state.deleteIn(path)
        : state.updateIn(path, List(), list => list.delete(list.indexOf(value)));
    default:
      return state;
  }
}


export function buildPatchFromEvent(evt, { path, isArray }) {
  let { type, value, checked } = evt.target;
  switch(type) {
    case 'checkbox':
      return isArray
        ? { op: checked ? 'add' : 'remove', path, value }
        : { op: 'replace', path, value: checked };
    case 'select-multiple':
      // value = evt.target.options.filter(o => o.selected).map(o => o.value);
      value = filter(evt.target.options, 'selected').map(o => o.value);
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
