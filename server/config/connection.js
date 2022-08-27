const mongoose = require('mongoose');
//revisit
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/hotspot', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = mongoose.connection;
