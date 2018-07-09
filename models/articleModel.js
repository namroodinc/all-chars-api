import mongoose from 'mongoose';

const modelSchema = mongoose.Schema({
  dateCreated: Number,
  dateModified: Number,
  datePublished: String,
  authors: [],
  description: String,
  factCheck: [],
  publicationId: String,
  sentiment: mongoose.Schema.Types.Mixed,
  title: String,
  trends: [],
  url: String,
  urlToImage: String,
  type: String
});

const Article = mongoose.model('Article', modelSchema);
export default {
  Article
};
