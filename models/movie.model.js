const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MovieSchema = new Schema({
  Movies: [
    {
      id: String,
      background_image: String,
      background_image_original: String,
      small_cover_image: String,
      medium_cover_image: String,
    },
  ],
});
const Movies = mongoose.model('Movies', MovieSchema);
module.exports = Movies;
