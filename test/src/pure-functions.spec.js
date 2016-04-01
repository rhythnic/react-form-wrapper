import expect from 'expect';
import { flattenPath, createPathObjects } from '../../src/pure-functions';
import Immutable, {Map, List} from 'immutable';

describe('pure-functions', function() {

  describe('flattenPath', function () {

    it("should flatten any nested array to it's first element", function() {
      const arr = [ 'one', ['two'], 'three', ['four', 'five']];
      const result = ['one', 'two', 'three', 'four']
      expect(flattenPath(arr)).toEqual(result);
    });

  });


  describe('createPathObjects', function () {

    it("create values in state based on path, omitting last path item", function() {
      const state = new Map();
      const path = ['one', ['two'], '0', 'three'];
      const newState = Immutable.fromJS({ one: { two: [ {} ] } })
      const result = createPathObjects(state, path);
      expect(result).toEqual(newState);
    });

  });

});
