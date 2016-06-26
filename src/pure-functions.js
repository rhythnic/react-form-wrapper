import Immutable, {List, Map} from 'immutable';
import flatten from 'lodash/flatten';
import filter from 'lodash/filter';
import get from 'lodash/fp/get';


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
