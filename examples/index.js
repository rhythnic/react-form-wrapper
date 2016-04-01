import React, { Component, createElement } from 'react';
import {render} from 'react-dom';

import * as data from './data';
import App from './App';
import Basic from './basic';
import Arrays from './arrays';


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
  }
]

render(<App exampleForms={exampleForms} />, document.getElementById('app'))
