import Immutable, {List, Map} from 'immutable';
import flatten from 'lodash/flatten';
import curry from 'lodash/fp/curry';


export function createPathObjects(state, path) {
  const setPath = [];
  return path.slice(0, -1).reduce((state, key) => {
    const isArr = Array.isArray(key);
    setPath.push(isArr ? key[0] : key);
    return state.updateIn(setPath, x => x == null ? isArr ? List() : Map() : x);
  }, state);
}


export function applyPatch (state, { op, path, value, flatPath }) {
  flatPath = flatPath || flatten(path);
  if (!state.hasIn(flatPath)) {
    state = createPathObjects(state, path);
  }
  if (value && op !== 'remove' && typeof value === 'object') {
    value = Immutable.fromJS(value);
  }
  switch(op) {
    case 'replace':
      return state.setIn(flatPath, value);
    case 'add':
      return state.updateIn(flatPath, List(), xs => xs.push(value));
    case 'remove':
      return value == null
        ? state.deleteIn(flatPath)
        : state.updateIn(flatPath, List(), xs => xs.delete(xs.indexOf(value)));
    default:
      return state;
  }
}


export const getValue = curry(function getValue({ pathToGetValue, isArray }, toJS, state) {
  const defaultValue = isArray ? List() : '';
  let value = state && state.getIn(pathToGetValue);
  value = value == null ? defaultValue : value;
  return (!toJS || typeof value !== 'object' || typeof value.toJS !== 'function') ? value : value.toJS();
});


export function fromJS(data) {
  return Immutable.fromJS(data);
}


export function toJS(data) {
  return data.toJS();
}
