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
    location_id: String
    geo_description: String
    name: String
    map_image_url: String
  }

  input LocationInput {  
    description: String!
    name: String!
    searchId: String
    image: String
  }

  type Query {
    me: User
    getLocations(name: String!): [Location]
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
