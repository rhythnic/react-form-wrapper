import React, { Component } from 'react';
import { connect } from 'react-redux';
import BasicForm from '../basic';
import { actions } from './redux-parts';

class ReduxExample extends Component {
  componentWillMount() {
    this.props.setData(this.props.value);
  }
  render() {
    const { updateForm, resetForm, onSubmit, myFormValues } = this.props;
    return <BasicForm
      value={myFormValues}
      onChange={updateForm}
      onSubmit={onSubmit}
      onReset={resetForm} />
  }
}

function mapStateToProps(state) {
  return {
    myFormValues: state.get('myForm')
  }
}

export default connect(mapStateToProps, actions)(ReduxExample);
