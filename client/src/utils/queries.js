import { gql } from '@apollo/client';

export const GET_ME = gql`
  {
    me {
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
export const QUERY_LOCATION = gql`
query getLocations($name: String!) {
  getLocations(name: $name) {
    location_id
    geo_description
    name
    map_image_url
    address
    image
  }
}`
