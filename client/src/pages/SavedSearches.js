/* eslint-disable no-unused-vars */
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeSearchId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_SEARCH } from '../utils/mutations';

const SavedSearches = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeLocation, { error }] = useMutation(REMOVE_SEARCH);

  const userData = data?.me || {};

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteSearch = async (location_id) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeLocation({
        variables: { location_id },
      });

      removeSearchId(location_id);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Your saved locations</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedSearches.length
            ? `Viewing ${userData.savedSearches.length} saved ${
                userData.savedSearches.length === 1 ? 'location' : 'locations'
              }:`
            : 'You have no saved locations!'}
        </h2>
        <CardColumns>
          {userData.savedSearches.map((location) => {
            return (
              <Card key={location.location_id} border="dark">
                {location.map_image_url ? (
                  <Card.Img
                    src={location.map_image_url}
                    alt={`Map for ${location.name}`}
                    variant="top"
                  />
                ) : location.image ? (
                  <Card.Img
                    src={location.image}
                    alt={`${location.name}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{location.name}</Card.Title>
                  <Card.Text>{location.address}</Card.Text>
                  <Card.Text>{location.geo_description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteSearch(location.location_id)}
                  >
                    Delete this location
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedSearches;
