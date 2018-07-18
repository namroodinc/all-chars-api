import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const personSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String
});

const storySchema = Schema({
  author: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
  title: String
});

const Story = mongoose.model('Story', storySchema);
const Person = mongoose.model('Person', personSchema);

export default {
  Story,
  Person
};
