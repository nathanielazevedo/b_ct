import mongoose from 'mongoose'

const partySchema = new mongoose.Schema(
  {
    name: String,
    location: String,
    max_distance: Number,
    number_of_restaurants: Number,
    max_voters: Number,
    times_to_vote_on: Array,
    vote_on_time: Boolean,
    password: String,
    restaurants: Array,
    r_votes: Object,
    t_votes: Object,
    r_winner: Object || null,
    t_winner: String || null,
    voters_so_far: Number,
    type: String,
  },
  { timestamps: true }
)

const Party = mongoose.model('parties', partySchema)

export default Party
