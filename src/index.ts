import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

import {
  getParty,
  createParty,
  voteParty,
  validatePassword,
  endParty,
  fetchRestaurants,
} from './controllers/Party'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 6001
const mongoURI = process.env.MONGO

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Routes
app.get('/', getParty)
app.post('/', createParty)
app.get('/party/:id', getParty)
app.post('/party/:id/vote', voteParty)
app.post('/party/:id/end', endParty)
app.post('/party/:id/password', validatePassword)
app.post('/restaurants', fetchRestaurants)

// MongoDB Connection
if (!mongoURI) {
  console.error('MONGO connection string is missing in .env file')
  process.exit(1)
}

mongoose
  .connect(mongoURI, { dbName: 'chickentinder' })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error(`❌ MongoDB connection error: ${err}`)
  })
