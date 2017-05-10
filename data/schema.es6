import User from './Models/UserSchema.es6';
import Hobby from './Models/HobbySchema.es6';

import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInterfaceType,
  GraphQLString,
  GraphQLInt,
  GraphQLInputObjectType
  } from 'graphql';

import {
  mutationWithClientMutationId
  } from 'graphql-relay';


let Node = new GraphQLInterfaceType({
  name: 'Node',
  description: 'An object with an ID',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The global unique ID of an object'
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The type of the object"
    }
  }),
  resolveType: (obj) => {
    if (obj.type === 'user') {
      return UserType;
    } else if (obj.type === 'hobby') {
      return HobbyType;
    }
  }
});

let HobbyType = new GraphQLObjectType({
  name: 'Hobby',
  description: 'A hobby',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    title: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    type: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }),

  interfaces: [Node]
});

let UserType = new GraphQLObjectType({
  name: 'User',
  description: 'A user',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: GraphQLString
    },
    surname: {
      type: GraphQLString
    },
    age: {
      type: GraphQLInt
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      description: 'The ships used by the faction.'
    },
    friends: {
      type: new GraphQLList(UserType)
    },
    type: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }),

  interfaces: [Node]
});

let nodeField = {
  name: 'Node',
  type: Node,
  description: 'A node interface field',
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Id of node interface'
    }
  },
  resolve: (obj, {id}) => {
    return User.getUserById(obj, {id: id})
      .then((user) => {
        return user ? user : Hobby.getHobbyById(obj, {id: id});
      }).then((hobby) => {
        return hobby;
      });
  }
};

let UserQueries = {
  users: {
    type: new GraphQLList(UserType),
    name: 'users',
    description: 'A user list',
    resolve: User.getListOfUsers
  },
  user: {
    type: UserType,
    args: {
      id: {
        type: GraphQLID
      }
    },
    resolve: (root, {id}) => {
      return User.getUserById(id)
    }
  }
};

let HobbyQueries = {
  hobby: {
    type: HobbyType,
    args: {
      id: {
        type: GraphQLID
      }
    },
    resolve: Hobby.getHobbyById
  },

  hobbies: {
    type: new GraphQLList(HobbyType),
    resolve: Hobby.getListOfHobbies
  }
};

let UserUpdateMutation = mutationWithClientMutationId({
  name: 'UpdateUser',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID) },
    age: { type: GraphQLInt },
    name: {type: GraphQLString },
    surname: {type: GraphQLString }
  },

  outputFields: {
    user: {
      type: UserType,
      resolve: ({id}) => {
        return User.getUserById(id)
      }
    }
  },

  mutateAndGetPayload: User.updateUser
});

let UserUpdateAgeMutation = mutationWithClientMutationId({
    name: 'UpdateAge',
    inputFields: {
        id: {type: new GraphQLNonNull(GraphQLID) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
    },

    outputFields: {
        user: {
            type: UserType,
            resolve: ({id}) => {
                return User.getUserById(id)
            }
        }
    },

    mutateAndGetPayload: User.updateAge
});



let AddRegisterMutation = mutationWithClientMutationId({
    name: 'AddRegister',
    inputFields: {

        name: { type: new GraphQLNonNull(GraphQLString) },
        surname: { type: new GraphQLNonNull(GraphQLString) }
    },

    outputFields: {
        user: {
            type: UserType,
            resolve: ({id}) => {
                return User.getUserById(id)
            }
        }
    },

    mutateAndGetPayload: User.addRegister
});

let RootQuery = new GraphQLObjectType({
  name: 'RootQuery',      //Return this type of object

  fields: () => ({
    user: UserQueries.user,
    users: UserQueries.users,
    hobby: HobbyQueries.hobby,
    hobbies: HobbyQueries.hobbies,
    node: nodeField
  })
});


let RootMutation = new GraphQLObjectType({
  name: "RootMutation",

  fields: () => ({
      updateAge: UserUpdateAgeMutation,

      addRegister: AddRegisterMutation,
    updateUser: UserUpdateMutation
  })
});


let schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});

export default schema;