import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const modelSchema = mongoose.Schema({
  dateCreated: Number,
  dateModified: Number,
  backgroundColor: {
    type: String,
    default: '#000'
  },
  country: String,
  description: String,
  disambiguation: String,
  featured: {
    type: Boolean,
    default: false
  },
  headquarters: String,
  ideology: [{
    type: Schema.Types.ObjectId,
    ref: 'Ideology'
  }],
  name: String,
  newsApiId: String,
  prettyName: String,
  shortenedUrl: String,
  twitterScreenName: String,
  url: String,
  urlToImage: String
});

const Publication = mongoose.model('Publication', modelSchema);
export default {
  Publication
};
