import test from 'tape';
import Immutable, { List, Map } from 'immutable';
import { buildPath } from '../src/utils';


test('buildPath', function (t) {
  const _buildPath = buildPath('.');
  let name = 'one.two';
  let path = ['one', 'two'];
  let result = _buildPath(name);
  t.deepEqual(result, path, 'returns name split by delimiter');
  name = 'one.two[]';
  path = [ 'one', ['two'] ];
  result = _buildPath(name);
  t.deepEqual(result, path, 'converts JS object property notation to nested arrays');
  path = ['one', ['two'], '0']
  let names = [ 'one.two[0]', 'one.two[].0' ];
  let results = [ _buildPath(names[0]), _buildPath(names[1]) ];
  t.deepEqual(results[0], results[1], 'It treats [0] and [].0 equally');
  t.end();
});
