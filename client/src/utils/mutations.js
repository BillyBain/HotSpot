import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        saveCount
      }
    }
  }
`;

export const SAVE_SEARCH = gql`
  mutation saveLocation($locationData: LocationInput!) {
    saveLocation(locationData: $locationData) {
      _id
      username
      email
      saveCount
      savedSearches {
        location_id
        geo_description
        name
        map_image_url
        address
        image
      }
    }
  }
`;

export const REMOVE_SEARCH = gql`
  mutation removeLocation($location_id: ID!) {
    removeLocation(location_id: $location_id) {
      _id
      username
      email
      saveCount
      savedSearches {
        location_id
        geo_description
        name
        map_image_url
        address
        image
      }
    }
  }
`;
