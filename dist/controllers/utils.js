import yelp from 'api';
import * as dotenv from 'dotenv';
dotenv.config();
const sdk = yelp('@yelp-developers/v1.0#deudoolf6o9f51');
const yelpKey = process.env.YELP;
export const likesToObj = (rLikes, obj) => {
    rLikes.forEach((vote) => {
        if (vote in obj)
            obj[vote]++;
        else
            obj[vote] = 0;
    });
    return obj;
};
export const getWinner = (obj, votes) => {
    const max = Math.max(...Object.values(votes));
    const winner = Object.keys(votes).find((key) => votes[key] === max);
    const result = obj.find((r) => r.id === winner);
    return result;
};
// Get Restaurants -> Restaurant[]
export const getRestaurants = async (info) => {
    const { location, max_distance, number_of_restaurants, type } = info;
    try {
        sdk.auth(`Bearer ${yelpKey}`);
        return sdk
            .v3_business_search({
            location: location,
            term: type,
            radius: max_distance,
            sort_by: 'best_match',
            limit: number_of_restaurants,
        })
            .then(({ data }) => {
            return data.businesses;
        })
            .catch((err) => {
            console.log(err);
            return err;
        });
    }
    catch (err) {
        throw new Error(err);
    }
};
export const partyNotFound = (res) => {
    return res.status(404).json({ message: 'Party not found' }).send();
};
export const makeVotesObjects = (data) => {
    const r_votes = {};
    const t_votes = {};
    data.restaurants.forEach((restaurant) => (r_votes[restaurant.id] = 0));
    data.times_to_vote_on.forEach((time) => (t_votes[time.id] = 0));
    return { r_votes, t_votes };
};
