import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import {
  getParty,
  createParty,
  voteParty,
  validatePassword,
  endParty,
  fetchRestaurants,
} from './controllers/Party.js';

dotenv.config();
const app = express();
const mongoKey = process.env.MONGO;

const PORT = process.env.PORT || 6001;
app.use(cors());
app.use(bodyParser.json({ limi: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.get('/', getParty);
// app.get("/restaurants", getRestaurants);
app.post('/', createParty);
app.post('/restaurants', fetchRestaurants);
app.get('/party/:id', getParty);
app.post('/party/:id/vote', voteParty);
app.post('/party/:id/password', validatePassword);
app.post('/party/:id/end', endParty);

mongoose
  .connect(`${mongoKey}`, {
    dbName: 'chickentinder',
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error}, did not connect.`));
