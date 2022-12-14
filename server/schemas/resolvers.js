const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { fetch } = require('cross-undici-fetch');

const api = process.env.API_KEY;
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('locations');
        return userData;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    getLocations: async (parent, { name }, context) => {
      const response = await fetch(
        `https://travel-advisor.p.rapidapi.com/locations/search?query=${name}&rapidapi-key=${api}`
      );
      const json = await response.json();
      
      let need = json.data.map((obj) => obj.result_object);
      const photo = json.data.map((obj) => obj.result_object).map((obj1) => obj1.photo).map((obj2) => obj2.images).map((obj3) => obj3.original);
      let final = [ ];

      for (let i = 0; i < need.length; i++) {
        const element = need[i];
        const image = photo.map((obj)=>obj.url)[i];
        let allData = { ...element, image};
        final.push(allData);
      }
      return final;
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },

    saveLocation: async (parent, { locationData }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedSearches: locationData } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('Please log in to save Locations.');
    },

    removeLocation: async (parent, { location_id }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedSearches: { location_id } } },
          { new: true }
        );

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
