import Party from "../models/Party.js";
// const sdk = require("api")("@yelp-developers/v1.0#deudoolf6o9f51");
import yes from "api";
import * as dotenv from "dotenv";
dotenv.config();
const sdk = yes("@yelp-developers/v1.0#deudoolf6o9f51");
const yelpKey = process.env.YELP;
// Get Party
export const getParty = async (req, res) => {
  const id = req.params.id;
  try {
    const party = await Party.find({ _id: id });
    res.status(200).json(party[0]);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Vote Party
export const voteParty = async (req, res) => {
  const id = req.params.id;
  const { votes } = req.body;
  try {
    const party = await Party.findOne({ _id: id });

    votes.forEach((vote) => {
      if (!party.votes.hasOwnProperty(vote)) {
        party.votes[vote] = 0;
      } else {
        party.votes[vote]++;
      }
    });
    const newVoters = Number(party.voters) + 1;
    if (newVoters === party.maxVoters) {
      const votes = party.votes;
      const max = Math.max(...Object.values(votes));
      const winner = Object.keys(votes).find((key) => votes[key] === max);
      const result = party.restaurants.find((r) => r.id === winner);
      await Party.updateOne(
        { _id: id },
        { winner: result, voters: newVoters, votes: party.votes }
      );
    } else {
      await Party.updateOne(
        { _id: id },
        { votes: party.votes, voters: newVoters }
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
const getRestaurants = async (location, maxDistance) => {
  try {
    sdk.auth(`Bearer ${yelpKey}`);
    return sdk
      .v3_business_search({
        location: location,
        term: "restaurants",
        radius: maxDistance,
        sort_by: "best_match",
        limit: "5",
      })
      .then(({ data }) => {
        return data.businesses;
      })
      .catch((err) => {
        return err;
      });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Create Party
export const createParty = async (req, res) => {
  try {
    const { name, location, maxDistance, maxVoters, password } = req.body;
    const restaurants = await getRestaurants(location, maxDistance);
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
      res.status(200).json({ message: "success" });
    } else {
      res.status(404).json({ message: "incorrect password" });
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
