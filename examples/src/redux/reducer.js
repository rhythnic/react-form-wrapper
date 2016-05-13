import Immutable from 'immutable';
import { update } from '../../form-wrapper';


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
    return state.set('myForm', update(state.get('myForm'), action.patch));
  default:
    return state;
  }
}
