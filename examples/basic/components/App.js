import React, {Component} from 'react';
import MyForm from './MyForm';

const hotel = {
  profile: {
    name: 'Bates Motel'
  },
  address: {
    street: '272nd St.',
    vacancy: true
  }
};

export default class App extends Component {
  render() {
    return <MyForm value={hotel} onSubmit={(data) => console.log(data)}/>
  }
}
