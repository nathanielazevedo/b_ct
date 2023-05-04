import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import {
  getParty,
  createParty,
  voteParty,
  validatePassword,
} from "./controllers/Party.js";

const app = express();

const PORT = process.env.PORT || 6001;
app.use(cors());
app.use(bodyParser.json({ limi: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.get("/", getParty);
// app.get("/restaurants", getRestaurants);
app.post("/", createParty);
app.get("/party/:id", getParty);
app.post("/party/:id/vote", voteParty);
app.post("/party/:id/password", validatePassword);

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