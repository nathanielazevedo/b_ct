import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import bodyParser from 'body-parser'
import {
  getParty,
  createParty,
  voteParty,
  validatePassword,
  endParty,
  fetchRestaurants,
} from './controllers/Party.js'

dotenv.config()
const app = express()
const mongoKey = process.env.MONGO
const PORT = process.env.PORT || 6001

app.use(cors())
app.use(bodyParser.json())
app.get('/', getParty)
app.post('/', createParty)
app.get('/party/:id', getParty)
app.post('/party/:id/end', endParty)
app.post('/party/:id/vote', voteParty)
app.post('/restaurants', fetchRestaurants)
app.post('/party/:id/password', validatePassword)

mongoose
  .connect(`${mongoKey}`, {
    dbName: 'chickentinder',
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
  })
  .catch((error) => console.log(`${error}, did not connect.`))
