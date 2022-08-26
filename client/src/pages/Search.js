/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from 'react-bootstrap';
import Auth from '../utils/auth';
import { saveSearchIds, getSavedSearchIds } from '../utils/localStorage';
import { searchGoogleBooks } from '../utils/API'; //revisit
import { SAVE_BOOK } from '../utils/mutations'; //revisit
import { useMutation } from '@apollo/client';

const Searches = () => {
  // create state for holding returned google api data
  const [searched, setSearch] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  const [saveSearch, { error }] = useMutation(SAVE_BOOK); //revisit

  // create state to hold saved searchId values
  const [savedSearchIds, setSavedSearchIds] = useState(getSavedSearchIds());

  useEffect(() => {
    return () => saveSearchIds(savedSearchIds);
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const searchData = items.map((search) => ({
        searchId: search.id,
        authors: search.volumeInfo.authors || ['No author to display'],
        title: search.volumeInfo.title,
        description: search.volumeInfo.description,
        image: search.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearch(searchData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSearch = async (searchId) => {
    const searchesToSave = searched.find(
      (search) => search.searchId === searchId
    );

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveSearch({
        variables: { searchData: { ...searchesToSave } },
      });

      setSavedSearchIds([...savedSearchIds, searchesToSave.searchId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1 className="text-primary font-italic">Start a search!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2 className="text-info">
          {searched.length
            ? `Viewing ${searched.length} results:`
            : 'Search to begin'}
        </h2>
        <CardColumns>
          {searched.map((search) => {
            return (
              <Card key={search.searchId} border="dark">
                {search.image
                  ? ((
                      <Card.Img
                        src={search.image}
                        alt={`The cover for ${search.title}`}
                        variant="top"
                      />
                    ),
                    {
                      /* revisit */
                    })
                  : null}
                <Card.Body>
                  <Card.Title>{search.title}</Card.Title>
                  <p className="small">Authors: {search.authors}</p>
                  <Card.Text>{search.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedSearchIds?.some(
                        (savedSearchId) => savedSearchId === search.searchId
                      )}
                      className="btn-block btn-info"
                      onClick={() => handleSaveSearch(search.searchId)}
                    >
                      {savedSearchIds?.some(
                        (savedSearchId) => savedSearchId === search.searchId
                      )
                        ? `You've already saved this!`
                        : 'Save this Search!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default Searches;
