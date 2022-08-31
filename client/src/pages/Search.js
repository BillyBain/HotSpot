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
import { SAVE_SEARCH } from '../utils/mutations';
import { useMutation, useLazyQuery } from '@apollo/client';
import { QUERY_LOCATION } from '../utils/queries';

const Searches = () => {
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  const [saveLocation, { error }] = useMutation(SAVE_SEARCH);

  const [seachLocations] = useLazyQuery(QUERY_LOCATION);
  const [locations, setLocations] = useState([]);

  const [savedSearchIds, setSavedSearchIds] = useState(getSavedSearchIds());

  useEffect(() => {
    return () => saveSearchIds(savedSearchIds);
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const name = searchInput;

    if (!name) {
      return;
    }

    try {
      const results = await seachLocations({ variables: { name } });

      if (!results) {
        throw new Error('something went wrong!');
      }

      const locationData = results.data.getLocations.map((location) => ({
        location_id: location.location_id,
        name: location.name,
        geo_description: location.geo_description,
        map_image_url: location.map_image_url,
        address: location.address,
        image: location.image,
      }));

      setLocations(locationData);
      setSearchInput('');
    } catch (error) {
      console.error('Somethings wrong', error);
    }
  };

  const handleSaveSearch = async (location_id) => {
    const searchesToSave = locations.find(
      (location) => location.location_id === location_id
    );

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveLocation({
        variables: { locationData: { ...searchesToSave } },
      });

      setSavedSearchIds([...savedSearchIds, searchesToSave.location_id]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div id="searchResultsBackground">
        <Jumbotron fluid className="text-light bg-dark" id="background">
          <Container>
            <h1 className="text-white text-border">Location search:</h1>
            <Form onSubmit={handleFormSubmit}>
              <Form.Row>
                <Col xs={12} md={8}>
                  <Form.Control
                    name="searchInput"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    type="text"
                    size="lg"
                    placeholder="Where do you want to go?"
                  />
                </Col>
                <Col xs={12} md={4}>
                  <Button type="submit" variant="primary" size="lg">
                    Search
                  </Button>
                </Col>
              </Form.Row>
            </Form>
          </Container>
        </Jumbotron>
        <Container>
          <h2 className="text-white text-border">
            {locations.length
              ? `Viewing ${locations.length} results:`
              : 'Search to begin'}
          </h2>
          <CardColumns>
            {locations.map((location) => {
              return (
                <Card key={location.location_id} border="dark">
                  {location.map_image_url ? (
                    <Card.Img
                      src={location.map_image_url}
                      alt={`Map of ${location.name}`}
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
                    <Card.Title>
                      <a
                        href={`https://www.google.com/search?q=${location.name}`}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {location.name}
                      </a>
                    </Card.Title>
                    <Card.Text>{location.address}</Card.Text>
                    <Card.Text>{location.geo_description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedSearchIds?.some(
                          (savedSearchId) =>
                            savedSearchId === location.location_id
                        )}
                        className="btn-block btn-primary"
                        onClick={() => handleSaveSearch(location.location_id)}
                      >
                        {savedSearchIds?.some(
                          (savedSearchId) =>
                            savedSearchId === location.location_id
                        )
                          ? `You've already saved this!`
                          : 'Save this Search'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              );
            })}
          </CardColumns>
        </Container>
      </div>
    </>
  );
};

export default Searches;
