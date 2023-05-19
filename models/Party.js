import mongoose from 'mongoose';

const partySchema = new mongoose.Schema(
  {
    name: String,
    restaurants: Array,
    votes: Object,
    password: String,
    winner: Object,
    maxVoters: Number,
    voters: Number,
    voteTime: Boolean,
    hours: Object,
    location: String,
    max_distance: Number,
    number_of_restaurants: Number,
  },
  { timestamps: true }
);

const Party = mongoose.model('partys', partySchema);

export default Party;
