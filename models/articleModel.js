import mongoose from 'mongoose';

const modelSchema = mongoose.Schema({
  dateCreated: Number,
  dateModified: Number,
  datePublished: String,
  factCheck: [],
  sentiment: mongoose.Schema.Types.Mixed,
  title: String,
  trends: [],
  url: String,
  type: String
});

const Article = mongoose.model('Article', modelSchema);
export default {
  Article
};
