import Party from '../models/Party.js'
import yes from 'api'
import * as dotenv from 'dotenv'
import bcrypt from 'bcrypt'
const saltRounds = 10

dotenv.config()
const sdk = yes('@yelp-developers/v1.0#deudoolf6o9f51')
const yelpKey = process.env.YELP

// Get Party
// return party
export const getParty = async (req, res) => {
  const id = req.params.id
  try {
    const party = await Party.findOne({ _id: id })
    if (!party) {
      res.status(404).json({ message: 'Party not found' })
      return
    }
    res.status(200).json(party)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

const likesToObj = (rLikes, obj) => {
  rLikes.forEach((vote) => {
    if (!obj.hasOwnProperty(vote)) obj[vote] = 0
    else obj[vote]++
  })
  return obj
}

const getWinner = (obj, votes) => {
  const max = Math.max(...Object.values(votes))
  const winner = Object.keys(votes).find((key) => votes[key] === max)
  const result = obj.find((r) => r.id === winner)
  return result
}

// Vote Party
// return updated party
export const voteParty = async (req, res) => {
  const id = req.params.id
  const { rLikes, tLikes } = req.body
  try {
    const party = await Party.findOne({ _id: id })
    const r_votes = likesToObj(rLikes, party.r_votes)
    const t_votes = tLikes ? likesToObj(tLikes, party.t_votes) : null
    const voters_so_far = Number(party.voters_so_far) + 1
    if (voters_so_far === party.max_voters) {
      const r_winner = getWinner(party.restaurants, party.r_votes)
      const t_winner = tLikes
        ? getWinner(party.times_to_vote_on, party.t_votes)
        : null
      await Party.updateOne(
        { _id: id },
        { r_winner, t_winner, voters_so_far, r_votes, t_votes }
      )
    } else {
      await Party.updateOne({ _id: id }, { voters_so_far, r_votes, t_votes })
    }
    const updatedParty = await Party.findOne({ _id: id })
    res.status(201).json(updatedParty)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: err.message })
  }
}

// Get Restaurants
// return array of restaurants
const getRestaurants = async (
  location,
  max_distance,
  number_of_restaurants
) => {
  try {
    sdk.auth(`Bearer ${yelpKey}`)
    return sdk
      .v3_business_search({
        location: location,
        term: 'restaurants',
        radius: max_distance,
        sort_by: 'best_match',
        limit: number_of_restaurants,
      })
      .then(({ data }) => {
        return data.businesses
      })
      .catch((err) => {
        console.log(err)
        return err
      })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// Fetch Restaurants
// return array of restaurants
export const fetchRestaurants = async (req, res) => {
  const { location, max_distance, number_of_restaurants } = req.body
  try {
    const restaurants = await getRestaurants(
      location,
      max_distance,
      number_of_restaurants
    )
    if (restaurants?.data?.error) {
      res
        .status(404)
        .json({ message: restaurants.data.error.description })
        .send()
      return
    }
    res.status(200).json(restaurants)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// Create Party
// return id and name
export const createParty = async (req, res) => {
  try {
    const { restaurants, times_to_vote_on } = req.body
    const r_votes = {}
    const t_votes = {}
    restaurants.forEach((restaurant) => (r_votes[restaurant.id] = 0))
    times_to_vote_on.forEach((time) => (t_votes[time.id] = 0))
    const party = new Party({
      ...req.body,
      password: await bcrypt.hash(req.body.password, saltRounds),
      restaurants,
      r_winner: null,
      t_winner: null,
      voters_so_far: 0,
      r_votes,
      t_votes,
    })
    const newParty = await party.save()
    res.status(200).json(newParty)
  } catch (err) {
    res.status(409).json({ message: err.message })
  }
}

// Validate Password
// return boolean
export const validatePassword = async (req, res) => {
  const id = req.params.id
  try {
    const party = await Party.findOne({ _id: id })
    bcrypt.compare(req.body.password, party.password, function (err, result) {
      if (result) {
        res.status(200).json({ message: 'success' })
      } else {
        res.status(404).json({ message: 'incorrect password' })
      }
    })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// Finish Party
// return new party
export const endParty = async (req, res) => {
  const id = req.params.id
  try {
    const party = await Party.findOne({ _id: id })
    const r_winner = getWinner(party.restaurants, party.r_votes)
    const t_winner = party.vote_on_time
      ? getWinner(party.times_to_vote_on, party.t_votes).id
      : null
    await Party.updateOne({ _id: id }, { r_winner, t_winner })
    const updatedParty = await Party.findOne({ _id: id })
    res.status(200).json(updatedParty)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: err.message })
  }
}
