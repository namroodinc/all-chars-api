import mongoose from 'mongoose';

const modelSchema = mongoose.Schema({
  dateCreated: Number,
  dateModified: Number,
  disambiguation: String,
  featured: {
    type: Boolean,
    default: false
  },
  name: String,
  newsApiId: String,
  shortenedUrl: String,
  url: String
});

const Publication = mongoose.model('Publication', modelSchema);
export default {
  Publication
};
