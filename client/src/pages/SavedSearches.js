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
import { GET_ME } from '../utils/queries'; //revisit
import { REMOVE_BOOK } from '../utils/mutations'; //revisit

const SavedSearches = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeSearch, { error }] = useMutation(REMOVE_BOOK);//revisit

  const userData = data?.me || {};

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteSearch = async (searchId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeSearch({
        variables: { searchId },
      });

      removeSearchId(searchId);
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
          <h1>Viewing saved searches!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedSearches.length
            ? `Viewing ${userData.savedSearches.length} saved ${
                userData.savedSearches.length === 1 ? 'book' : 'books'//revisit
              }:`
            : 'You have no saved searches!'}
        </h2>
        <CardColumns>
          {userData.savedSearches.map((search) => {
            return (
              <Card key={search.searchId} border="dark">
                {search.image ? (
                  <Card.Img
                    src={search.image}
                    alt={`The cover for ${search.title}`} //revisit
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{search.title}</Card.Title>
                  <p className="small">Authors: {search.authors}</p>{/*revisit*/}
                  <Card.Text>{search.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteSearch(search.searchId)}
                  >
                    Delete this Search!
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
