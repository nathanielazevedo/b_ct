import Party from '../models/Party.js';
import yes from 'api';
import * as dotenv from 'dotenv';
dotenv.config();
const sdk = yes('@yelp-developers/v1.0#deudoolf6o9f51');
const yelpKey = process.env.YELP;
// Get Party
export const getParty = async (req, res) => {
  const id = req.params.id;
  try {
    const party = await Party.findOne({ _id: id });
    if (!party) {
      res.status(404).json({ message: 'Party not found' });
      return;
    }
    res.status(200).json(party);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const rLikesToObj = (rLikes, party) => {
  rLikes.forEach((vote) => {
    if (!party.votes.hasOwnProperty(vote)) {
      party.votes[vote] = 0;
    } else {
      party.votes[vote]++;
    }
  });
  return party.votes;
};

const getRWinner = (party) => {
  const votes = party.votes;
  const max = Math.max(...Object.values(votes));
  const winner = Object.keys(votes).find((key) => votes[key] === max);
  const result = party.restaurants.find((r) => r.id === winner);
  return result;
};

const getTWinner = (party) => {
  const votes = party.hours;
  const max = Math.max(...Object.values(votes));
  const winner = Object.keys(votes).find((key) => votes[key] === max);
  return winner;
};

// Vote Party
export const voteParty = async (req, res) => {
  const id = req.params.id;
  const { rLikes, tLikes } = req.body;

  try {
    const party = await Party.findOne({ _id: id });
    const newVotes = rLikesToObj(rLikes, party);
    const newVoters = Number(party.voters) + 1;

    if (newVoters === party.maxVoters) {
      // if all voters have voted
      const winner = getRWinner(party);
      const tWinner = getTWinner(party);
      tLikes.winner = tWinner;
      await Party.updateOne(
        { _id: id },
        { winner, voters: newVoters, votes: newVotes, hours: tLikes }
      );
    } else {
      // if not all voters have voted
      await Party.updateOne(
        { _id: id },
        { votes: newVotes, voters: newVoters, hours: tLikes }
      );
    }
    const updatedParty = await Party.findOne({ _id: id });
    res.status(201).json(updatedParty);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};

// Get Restaurants
const getRestaurants = async (
  location,
  max_distance,
  number_of_restaurants
) => {
  console.log(max_distance);
  try {
    sdk.auth(`Bearer ${yelpKey}`);
    return sdk
      .v3_business_search({
        location: location,
        term: 'restaurants',
        radius: max_distance,
        sort_by: 'best_match',
        limit: number_of_restaurants,
      })
      .then(({ data }) => {
        console.log(data);
        return data.businesses;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Fetch Restaurants
export const fetchRestaurants = async (req, res) => {
  const { location, max_distance, number_of_restaurants } = req.body;
  try {
    const restaurants = await getRestaurants(
      location,
      max_distance,
      number_of_restaurants
    );
    if (restaurants?.data?.error) {
      res
        .status(404)
        .json({ message: restaurants.data.error.description })
        .send();
      return;
    }
    res.status(200).json(restaurants);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Create Party
export const createParty = async (req, res) => {
  try {
    const {
      name,
      location,
      max_distance,
      maxVoters,
      password,
      number_of_restaurants,
      restaurants,
      voteTime,
      hours,
    } = req.body;
    console.log(hours);
    // const restaurants = await getRestaurants(location, maxDistance);
    if (restaurants?.data?.error) {
      res
        .status(404)
        .json({ message: restaurants.data.error.description })
        .send();
      return;
    }
    const votes = {};
    restaurants.forEach((restaurant) => (votes[restaurant.id] = 0));
    const newParty = new Party({
      name,
      restaurants,
      maxVoters,
      password,
      voters: 0,
      votes,
      voteTime,
      hours,
      location,
      max_distance,
      number_of_restaurants,
    });
    const newerParty = await newParty.save();
    res.status(200).json(newerParty);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// Validate Password
export const validatePassword = async (req, res) => {
  const id = req.params.id;
  try {
    const party = await Party.findOne({ _id: id });
    if (party.password === req.body.password) {
      res.status(200).json({ message: 'success' });
    } else {
      res.status(404).json({ message: 'incorrect password' });
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Finish Party
export const endParty = async (req, res) => {
  const id = req.params.id;
  try {
    const party = await Party.findOne({ _id: id });
    const votes = party.votes;
    const max = Math.max(...Object.values(votes));
    const winner = Object.keys(votes).find((key) => votes[key] === max);
    const result = party.restaurants.find((r) => r.id === winner);
    await Party.updateOne({ _id: id }, { winner: result });
    res.status(200).json({ winner: winner });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* 
  If there is a top restaurant, it wins
  If there is a tie, the computer randomly chooses a winner
*/
