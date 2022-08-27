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
    location_id: String
    name: String
    geo_description: String
    map_image_url: String
  }

  input LocationInput {
    location_id: String
    name: String
    geo_description: String
    map_image_url: String
  }

  type Query {
    me: User
    getLocations(name: String!): [Location]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveLocation(locationData: LocationInput!): User
    removeLocation(location_id: ID!): User
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;
