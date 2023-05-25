import mongoose from 'mongoose'

const partySchema = new mongoose.Schema(
  {
    name: String,
    location: String,
    max_distance: Number,
    number_of_restaurants: Number,
    max_voters: Number,
    hours_to_vote_on: Array,
    days_to_vote_on: Array,
    vote_on_hours: Boolean,
    vote_on_days: Boolean,
    password: String,
    restaurants: Array,
    r_votes: Object,
    h_votes: Object,
    d_votes: Object,
    r_winner: Object || null,
    t_winner: String || null,
    d_winner: String || null,
    voters_so_far: Number,
    type: String,
  },
  { timestamps: true }
)

const Party = mongoose.model('parties', partySchema)

export default Party
