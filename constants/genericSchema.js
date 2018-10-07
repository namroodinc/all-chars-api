import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default {
  _id: Schema.Types.ObjectId,
  dateCreated: Number,
  dateModified: Number,
  description: String,
  name: String
};
