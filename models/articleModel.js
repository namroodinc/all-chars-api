import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const authorSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  publication: {
    type: Schema.Types.ObjectId,
    ref: 'Publication'
  }
});

const articleSchema = Schema({
  dateCreated: Number,
  dateModified: Number,
  datePublished: Date,
  authors: [{
    type: Schema.Types.ObjectId,
    ref: 'Author'
  }],
  description: String,
  publication: {
    type: Schema.Types.ObjectId,
    ref: 'Publication'
  },
  shortUrl: String,
  title: String,
  trends: [],
  url: String,
  urlToImage: String,
  type: String
});

const Author = mongoose.model('Author', authorSchema);
const Article = mongoose.model('Article', articleSchema);

export default {
  Author,
  Article
};
