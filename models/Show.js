const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: String,
  cast: [
    {
      id: Number,
      name: String,
      birthday: Date,
    }
  ]
});

module.exports = mongoose.model('Show', ShowSchema);