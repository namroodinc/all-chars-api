import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const authorSchema = Schema({
  bio: String,
  instagram: String,
  name: String,
  prettyName: String,
  publication: {
    type: Schema.Types.ObjectId,
    ref: 'Publication'
  },
  twitter: String
});

const articleSchema = Schema({
  authors: [{
    type: Schema.Types.ObjectId,
    ref: 'Author'
  }],
  dateCreated: Number,
  dateModified: Number,
  datePublished: Date,
  description: String,
  disableReviews: {
    type: Boolean,
    default: false
  },
  locale: {
    type: String,
    default: 'en_GB'
  },
  publication: {
    type: Schema.Types.ObjectId,
    ref: 'Publication'
  },
  section: String,
  shortUrl: String,
  title: String,
  trends: [],
  url: String,
  urlToImage: String,
  type: String
});

const Author = mongoose.model('Author', authorSchema);
const Article = mongoose.model('Article', articleSchema);

authorSchema.pre('save', function(next) {
  Author
    .findOne({
      name: this.name
    }, function (err, author) {
      if (author === null) {
        next();
      } else {
        next(
          new Error('Author exists')
        );
      }
    });
});

articleSchema.pre('save', function(next) {
  Article
    .findOne({
      url: this.url
    }, function (err, author) {
      if (author === null) {
        next();
      } else {
        next(
          new Error('Article exists')
        );
      }
    });
});

export default {
  Author,
  Article
};
