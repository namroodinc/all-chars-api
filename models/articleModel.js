import mongoose from 'mongoose';
const Schema = mongoose.Schema;

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
  trends: [{
    type: Schema.Types.ObjectId,
    ref: 'Trend'
  }],
  url: String,
  urlToImage: String,
  type: String
});

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

const trendSchema = Schema({
  description: String,
  name: String,
  prettyName: String
});

articleSchema.pre('save', function(next) {
  Article
    .findOne({
      url: this.url
    }, function (err, article) {
      if (article === null) {
        next();
      } else {
        next(
          new Error('Article exists')
        );
      }
    });
});

authorSchema.pre('save', function(next) {
  Author
    .findOne({
      name: this.name
    }, function (err, author) {
      if (author === null) {
        next();
      } else {
        next(author);
      }
    });
});

trendSchema.pre('save', function(next) {
  Trend
    .findOne({
      name: this.name
    }, function (err, trend) {
      if (trend === null) {
        next();
      } else {
        next(trend);
      }
    });
});

const Article = mongoose.model('Article', articleSchema);
const Author = mongoose.model('Author', authorSchema);
const Trend = mongoose.model('Trend', trendSchema);

export default {
  Article,
  Author,
  Trend
};
