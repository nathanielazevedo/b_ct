import express from "express";
// import { json } from "body-parser";
// import mongoose from "mongoose";
// import { getParty } from "./src/controllers/Party";

const app = express();
// app.use(json());

const PORT = process.env.PORT || 6001;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// mongoose
//   .connect(
//     "mongodb+srv://nate:Dogsdancing5!@cluster0.tlv689x.mongodb.net/?retryWrites=true&w=majority",
//     {
//       dbName: "chickentinder",
//     }
//   )
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

//     /* ADD DATA ONE TIME */
//     // User.insertMany(users);
//     // Post.insertMany(posts);
//   })
//   .catch((error) => console.log(`${error}, did not connect.`));
