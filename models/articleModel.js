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
  section: {
    type: Schema.Types.ObjectId,
    ref: 'Section'
  },
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
  description: String,
  instagram: String,
  name: String,
  prettyName: String,
  publication: {
    type: Schema.Types.ObjectId,
    ref: 'Publication'
  },
  twitter: String
});

const sectionSchema = Schema({
  description: String,
  name: String,
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Section'
  },
  prettyName: String,
  urlToImage: String
});

const trendSchema = Schema({
  description: String,
  name: String,
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Trend'
  },
  prettyName: String,
  urlToImage: String
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

sectionSchema.pre('save', function(next) {
  Section
    .findOne({
      name: this.name
    }, function (err, section) {
      if (section === null) {
        next();
      } else {
        next(section);
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
const Section = mongoose.model('Section', sectionSchema);
const Trend = mongoose.model('Trend', trendSchema);

export default {
  Article,
  Author,
  Section,
  Trend
};
