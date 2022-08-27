const { Schema } = require('mongoose');

const locationSchema = new Schema({
  geo_description: {
    type: String,
    required: true,
  },

  location_id: {
    type: String,
    required: true,
  },
  map_image_url: {
    type: String,
  },

  name: {
    type: String,
    required: true,
  },
});

module.exports = locationSchema;
