import React, { Component, createElement } from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import * as data from './data';
import App from './App';
import BasicExample from './basic';
import ArraysExample from './arrays';
import ReduxExample from './redux';
import Validation from './validation';
import TypesExample from './types';
import reducer from './redux/reducer';


const store = createStore(reducer);


const exampleForms = [
  {
    label: 'Basic',
    component: BasicExample,
    props: {
      value: data.basic
    }
  },
  {
    label: 'Arrays',
    component: ArraysExample,
    props: {
      value: data.arrays,
      tourOptions: [ 'Blue Hole', 'Waterfall', 'Sailing' ]
    }
  },
  {
    label: 'Redux',
    component: ReduxExample,
    props: {
      value: data.basic
    }
  },
  {
    label: 'Types',
    component: TypesExample,
    props: {
      value: {}
    }
  },
  {
    label: 'Validation',
    component: Validation,
    props: {
      value: {}
    }
  }
]

render(
  <Provider store={store}>
    <App exampleForms={exampleForms} />
  </Provider>,
  document.getElementById('app'))
