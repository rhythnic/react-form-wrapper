import test from 'tape';
import { getPath, PATH_ARRAY_RE, isArrayField } from '../src/class-methods';


test('getPath', function (t) {
  const component = {
    _paths: {},
    _delimiter: '.'
  };

  let result = getPath.call(component, 'one');
  t.equal(result, component._paths.one, "It caches new names, and returns path from cache if possible.");
  let { name, path } = { name: 'one.two[]', path: [ 'one', ['two'] ] };
  result = getPath.call(component, name);
  t.deepEqual(component._paths[name], path, "It converts JSON syntax to array");
  path = ['one', ['two'], '0']
  let names = [ 'one.two[0]', 'one.two[].0' ];
  let results = [ getPath.call(component, names[0]), getPath.call(component, names[1]) ];
  t.deepEqual(results[0], results[1], "It treats [0] and [].0 equally");
  t.end();
});



test('isArrayField', function (t) {
  const component = {
    _paths: {},
    _delimiter: '.'
  };

  t.ok(isArrayField.call(component, 'one.two[]'),     "It returns true if the last node in the path is an array.");
  t.notOk(isArrayField.call(component, 'one.three'),  "It returns false if the last node in the path is not an array");
  t.notOk(isArrayField.call(component, 'one.two[0]'), "It returns false if the last node is an index in an array");
  t.end();
});
