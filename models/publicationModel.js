import mongoose from 'mongoose';

const modelSchema = mongoose.Schema({
  dateCreated: Number,
  dateModified: Number,
  avatarUrlToImage: String,
  backgroundColor: {
    type: String,
    default: '#000'
  },
  country: String,
  disambiguation: String,
  featured: {
    type: Boolean,
    default: false
  },
  headquarters: String,
  name: String,
  newsApiId: String,
  shortenedUrl: String,
  twitterScreenName: String,
  url: String
});

const Publication = mongoose.model('Publication', modelSchema);
export default {
  Publication
};
