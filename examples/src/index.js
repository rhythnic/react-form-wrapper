import React, { Component, createElement } from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import * as data from './data';
import App from './App';
import Basic from './basic';
import Arrays from './arrays';
import ReduxExample from './redux';
import reducer from './redux/reducer';


const store = createStore(reducer);


const exampleForms = [
  {
    label: 'Basic',
    component: Basic,
    props: {
      value: data.basic
    }
  },
  {
    label: 'Arrays',
    component: Arrays,
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
  }
]

render(
  <Provider store={store}>
    <App exampleForms={exampleForms} />
  </Provider>,
  document.getElementById('app'))
