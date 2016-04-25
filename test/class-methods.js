import test from 'tape';
import sinon from 'sinon';
import { assign } from 'lodash';
import Immutable, { Map } from 'immutable';
import { getPath, PATH_ARRAY_RE, isArrayField, changeHandler, normalizePatchOrEvent
  } from '../src/class-methods';

function selfFactory() {
  return {
    state: { value: new Map() },
    _paths: {},
    _delimiter: '.',
    _isMounted: true,
    props: {},
    setState(vals) {
      this.state = assign({}, this.state, vals);
    }
  };
}


test('getPath', function (t) {
  const self = selfFactory();
  let result = getPath.call(self, 'one');
  t.equal(result, self._paths.one, "It caches new names, and returns path from cache if possible.");
  let { name, path } = { name: 'one.two[]', path: [ 'one', ['two'] ] };
  result = getPath.call(self, name);
  t.deepEqual(self._paths[name], path, "It converts JSON syntax to array");
  path = ['one', ['two'], '0']
  let names = [ 'one.two[0]', 'one.two[].0' ];
  let results = [ getPath.call(self, names[0]), getPath.call(self, names[1]) ];
  t.deepEqual(results[0], results[1], "It treats [0] and [].0 equally");
  t.end();
});


test('isArrayField', function (t) {
  const self = selfFactory();
  t.ok(isArrayField.call(self, 'one.two[]'),     "It returns true if the last node in the path is an array.");
  t.notOk(isArrayField.call(self, 'one.three'),  "It returns false if the last node in the path is not an array");
  t.notOk(isArrayField.call(self, 'one.two[0]'), "It returns false if the last node is an index in an array");
  t.end();
});


test('normalizePatchOrEvent', function (t) {
  const self = selfFactory();
  let evt = { target: { name: 'one', value: 1 } }
  let patch = { op: 'replace', path: ['one'], value: 1 };
  let result = normalizePatchOrEvent.call(self, evt);
  t.deepEqual(result, patch, "It normalizes event to patch");
  const patch2 = { op: 'replace', path: 'one', value: 1 };
  result = normalizePatchOrEvent.call(self, patch2);
  t.deepEqual(result.path, ['one'], "It converts string path to array form");
  t.end();
});

test('changeHandler', function (t) {
  const self = selfFactory();
  let patch = { op: 'replace', path: ['one'], value: 1 };
  let result = changeHandler.call(self, patch);
  let value = new Map({one: 1});
  t.ok(Immutable.is(self.state.value, value), "It updates state.value by applying patch if !this.onChange");
  self.props.onChange = sinon.spy();
  result = changeHandler.call(self, patch);
  t.ok(self.props.onChange.calledWith(patch), "If onChange is a prop, it is invoked with the patch.")
  // const patch2 = { op: 'replace', path: 'one', value: 1 };
  // result = normalizePatchOrEvent.call(self, patch2);
  // t.deepEqual(result.path, ['one'], "It converts string path to array form");
  t.end();
});


// if no this.onChange and self is not mounted, return false
// if updates state value by applying patch
  //


// export function changeHandler(patch) {
//   if (!patch.op) {
//     // normalize event to patch object
//     const path = getPath.call(this, patch.target.name);
//     patch = buildPatchFromEvent(patch, path);
//   }
//   if (isString(patch.path)) {
//     patch.path = getPath.call(this, patch.path);
//   }
//
//   const { onChange } = this.props;
//   if (onChange && typeof onChange === 'function') {
//     return onChange(patch);
//   }
//   if (!this._isMounted) { return false; }
//   this.setState({value: update(this.state.value, patch)});
//
// }
