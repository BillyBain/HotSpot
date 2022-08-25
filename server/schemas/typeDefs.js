const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String
    email: String
    saveCount: Int
    savedSearches: [Location]
  }

  type Location {
    _id: ID!
    searchId: String
    description: String
    name: String!
    image: String
  }

  input LocationInput {  
    description: String!
    name: String!
    searchId: String
    image: String
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveLocation(locationData: LocationInput!): User
    removeLocation(searchId: ID!): User
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;
