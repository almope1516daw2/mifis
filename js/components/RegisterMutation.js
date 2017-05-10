import Relay from 'react-relay';
export default class RegisterMutation extends Relay.Mutation {
    static fragments = {
        user: () => Relay.QL`
      fragment on User {
        name
        surname
      }
    `
    };

    getMutation () {
        return Relay.QL`mutation { addRegister }`;
    }

    getVariables () {
        console.log("getVariables: " + this.props.name + " / " + this.props.surname)
        return {
            name: this.props.name,
            surname: this.props.surname,

        }
    }


    getFatQuery () {
        console.log("getFatQuery: " + this.props.name + " / " + this.props.surname)

        return Relay.QL`
      fragment on AddRegisterPayload {
        user {
          name
          surname
        }
      }
    `
    }



    getConfigs () {
        console.log("getConfigs: " + this.props.name + " / " + this.props.surname)

        /*return [{
            type: 'FIELDS_CHANGE',
            fieldIDs: {
                user: this.props.user
            }
        }];*/
        return [{
            type: 'FIELDS_CHANGE',
            fieldIDs: this.props.user,

        }];
    }

    getOptimisticResponse() {
        console.log("getOptim: " + this.props.name + " / " + this.props.surname)

        return {
            user: {
                name: this.props.name,
                surname: this.props.surname
            }
        };
    }
}