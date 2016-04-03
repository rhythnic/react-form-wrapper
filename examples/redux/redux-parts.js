import {createStore} from 'redux';
import Immutable from 'immutable';
import {update} from '../form-wrapper';

const defaultState = Immutable.fromJS({
  data: null,
  myForm: null
});

export const actions = {
  setData(data) {
    return {
      type: 'SET_DATA',
      data
    }
  },
  updateForm(patch) {
    return {
      type: 'UPDATE_FORM',
      patch
    };
  },
  resetForm() {
    return {
      type: 'RESET_FORM'
    };
  }
}

function reducer(state = defaultState, action) {
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

export const store = createStore(reducer);
