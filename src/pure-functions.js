import {List, Map} from 'immutable';

export function update (state, evt, delimiter) {
  let {op, path, value} = getPatchFromEvent(evt);
  path = path.split(delimiter);

  switch(op) {
    case 'replace':
      return state.updateIn(path, () => value);
    case 'add':
      return state.updateIn(path, List(), (val) => val.push(value));
    case 'remove':
      return state.updateIn(path, List(), (val) => val.delete(val.indexOf(value)));
    default:
      return state;
  }
}

export function getPatchFromEvent(evt) {
  if (!evt.target) { return evt; }
  let { type, name, value, checked } = evt.target;
  switch(type) {
    case 'checkbox':
      const fieldType = evt.target.dataset.type;
      return fieldType === 'array'
        ? { op: checked ? 'add' : 'remove', path: name, value }
        : { op: 'replace', path: name, value: checked };
    case 'select-multiple':
      value = [].map.call(evt.target.querySelectorAll('option:checked'), o => o.value);
      return {op: 'replace', path: name, value: new List(value)};
    default:
      return { path: name, op: 'replace', value }
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
