import Immutable from 'immutable';
import { applyPatch } from '../../../src/immutable-js-state';


export const defaultState = Immutable.fromJS({
  data: null,
  myForm: null
});


export default function reducer(state = defaultState, action) {
  switch(action.type) {
  case 'SET_DATA':
    const data = Immutable.fromJS(action.data);
    return state.withMutations(s => {
      s.set('data', data).set('myForm', data);
    });
  case 'RESET_FORM':
    return state.set('myForm', state.get('data'));
  case 'UPDATE_FORM':
    return state.set('myForm', applyPatch(state.get('myForm'), action.patch));
  default:
    return state;
  }
}
