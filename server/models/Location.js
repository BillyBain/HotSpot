const { Schema } = require('mongoose');


const locationSchema = new Schema({

  description: {
    type: String,
    required: true,
  },
  
  searchId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },

  name: {
    type: String,
    required: true,
  },
});

module.exports = locationSchema;
