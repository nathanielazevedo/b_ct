import express from "express";
import cors from "cors";
// import { json } from "body-parser";
import mongoose from "mongoose";
// import { getParty } from "./src/controllers/Party.js";
// import { getParty } from "./PartyC.js";

export const getParty = async (req, res) => {
  try {
    const post = await Party.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const partySchema = new mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const Party = mongoose.model("partys", partySchema);

const app = express();
// app.use(json());

const PORT = process.env.PORT || 6001;
app.use(cors());
app.get("/", getParty);

// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`);
// });

mongoose
  .connect(
    "mongodb+srv://nate:Dogsdancing5!@cluster0.tlv689x.mongodb.net/?retryWrites=true&w=majority",
    {
      dbName: "chickentinder",
    }
  )
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error}, did not connect.`));
