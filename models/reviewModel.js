import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const modelSchema = mongoose.Schema({
  dateCreated: Number,
  dateModified: Number,
  datePublished: Date,
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  },
  message: String
});

const Review = mongoose.model('Review', modelSchema);
export default {
  Review
};
