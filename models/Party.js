import mongoose from "mongoose";

const partySchema = new mongoose.Schema(
  {
    name: String,
    restaurants: Array,
    votes: Object,
    password: String,
    expirationDate: Date,
    winner: Object,
    maxVoters: Number,
    voters: Number,
  },
  { timestamps: true }
);

const Party = mongoose.model("partys", partySchema);

export default Party;
