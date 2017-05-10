import Relay from 'react-relay';
import RegisterMutation from './RegisterMutation.js';
import React from 'react';

class Register extends React.Component {

  constructor(props){
    super(props);
      this.state = {name: "", surname:""};
      console.log(this.state);
  }

  saveAge = () => {

      console.log(this.state.name);
      console.log(this.state.surname);

      Relay.Store.update(new RegisterMutation({
      name: this.state.name,
      surname: this.state.surname
    }));
  };

  handleChange = (event) => {
    switch(event.target.name){
        case "name":
            this.setState({name:event.target.value});
          break;
        case "surname":
            this.setState({surname:event.target.value});
          break;
    }

  };




  render() {
    let component;

      component =
        <div>
          <input  onChange={this.handleChange} type="text" placeholder="name" name="name" />
          <input  onChange={this.handleChange} type="text" placeholder="surname" name="surname"/>
          <button onClick={this.saveAge}>Add</button>
        </div>
      ;


    return component;
  }
}




exports.Register = Relay.createContainer(Register, {
  fragments: {
    // You can compose a mutation's query fragments like you would those
    // of any other RelayContainer. This ensures that the data depended
    // upon by the mutation will be fetched and ready for use.
    user: () => Relay.QL`
      fragment on User {
        name
        surname
       ${RegisterMutation.getFragment('user')}

      }
    `
  }
});

/*${RegisterMutation.getFragment('user')},*/



//class AgeMutation extends Relay.Mutation {
//  static fragments = {
//    user: () => Relay.QL`
//      fragment on User {
//        id
//      }
//    `
//  };
//
//  getMutation () {
//    return Relay.QL`mutation { updateAge }`;
//  }
//
//  getVariables () {
//    return {
//      age: this.props.age,
//      id: this.props.user.id
//    }
//  }
//
//
//  getFatQuery () {
//    return Relay.QL`
//      fragment on UpdateAgePayload {
//        user {
//          age
//        }
//      }
//    `
//  }
//
//  getConfigs () {
//    return [{
//      type: 'FIELDS_CHANGE',
//      fieldIDs: {
//        user: this.props.user.id
//      }
//    }];
//  }
//
//  getOptimisticResponse() {
//    return {
//      user: {
//        id: this.props.user.id,
//        age: this.props.age
//      },
//    };
//  }
//}

//exports.AgeMutation = AgeMutation;