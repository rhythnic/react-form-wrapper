import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';

export default class App extends Component {
  constructor(...args) {
    super(...args);
    this.state = { selectedExample: 2 };
  }
  onSubmit(data) {
    if (this.state.selectedExample === 2) { // redux example
      const {store} = this.context;
      data = store.getState().get('myForm').toJS();
    }
    console.log(data);
  }
  render() {
    const { exampleForms } = this.props;
    const example = exampleForms[this.state.selectedExample];
    return <div>
      <ul>
        {exampleForms.map((ex, i) => <li key={i}>
          <a
            href="#"
            style={ { color: i === this.state.selectedExample ? '#000' : '#b4b4b4' } }
            onClick={() => this.setState({selectedExample: i })} >
            {ex.label}
          </a>
        </li> )}
      </ul>
      <hr/>
      {createElement(example.component, Object.assign({}, example.props, {
        onSubmit: this.onSubmit.bind(this)
      }))}
    </div>
  }
}

App.contextTypes = {
  store: PropTypes.object
}
