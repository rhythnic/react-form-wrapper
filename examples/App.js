import React, { Component, createElement } from 'react';

export default class App extends Component {
  constructor(...args) {
    super(...args);
    this.state = { selectedExample: 0 };
  }
  onSubmit(data) {
    console.log(data);
  }
  render() {
    const { exampleForms } = this.props;
    const example = exampleForms[this.state.selectedExample];
    return <div>
      <ul>
        {exampleForms.map((ex, i) => <li key={i}>
          <a href="#" onClick={() => this.setState({selectedExample: i })}>{ex.label}</a>
        </li> )}
      </ul>
      <hr/>
      {createElement(example.component, Object.assign({}, example.props, {
        onSubmit: this.onSubmit.bind(this)
      }))}
    </div>
  }
}
