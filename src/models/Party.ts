import mongoose from "mongoose";

const partySchema = new mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const Party = mongoose.model("partys", partySchema);
export default Party;
