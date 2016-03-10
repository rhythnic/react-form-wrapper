import expect from 'expect';
import { getPatchFromEvent } from '../../src/pure-functions';

describe('getPatchFromEvent', function () {

  it('should return the object if no target proprerty', function() {
    const customEvent = {};
    const result = getPatchFromEvent(customEvent)
    expect(result).toBe(customEvent);
  });

});
