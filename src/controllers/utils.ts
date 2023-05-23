import yelp from 'api'

import * as dotenv from 'dotenv'
import { TypedRequestBody } from '../interfaces/Request'
import { CustomRestaurant, Restaurant } from '../interfaces/Restaurant'

dotenv.config()
const sdk = yelp('@yelp-developers/v1.0#deudoolf6o9f51')
const yelpKey = process.env.YELP

export const likesToObj = (rLikes: string[], obj: any) => {
  rLikes.forEach((vote: any) => {
    if (vote in obj) obj[vote]++
    else obj[vote] = 0
  })
  return obj
}

export const getWinner = (obj: any, votes: { [key: string]: number }) => {
  const max = Math.max(...Object.values(votes))
  const winner = Object.keys(votes).find((key) => votes[key] === max)
  const result = obj.find((r: any) => r.id === winner)
  return result
}

// Get Restaurants -> Restaurant[]
export const getRestaurants = async (info: {
  location: string
  max_distance: number
  number_of_restaurants: number
  type: string
}) => {
  const { location, max_distance, number_of_restaurants, type } = info
  try {
    sdk.auth(`Bearer ${yelpKey}`)
    return sdk
      .v3_business_search({
        location: location,
        term: type,
        radius: max_distance,
        sort_by: 'best_match',
        limit: number_of_restaurants,
      })
      .then(({ data }: any) => {
        return data.businesses
      })
      .catch((err: any) => {
        console.log(err)
        return err
      })
  } catch (err) {
    throw new Error(err)
  }
}

export const partyNotFound = (res: any) => {
  return res.status(404).json({ message: 'Party not found' }).send()
}

export const makeVotesObjects = (data: {
  restaurants: (Restaurant | CustomRestaurant)[]
  times_to_vote_on: { id: string }[]
}) => {
  const r_votes = {} as { [key: string]: number }
  const t_votes = {} as { [key: string]: number }
  data.restaurants.forEach((restaurant) => (r_votes[restaurant.id] = 0))
  data.times_to_vote_on.forEach((time) => (t_votes[time.id] = 0))
  return { r_votes, t_votes }
}

export type CreatePartyReq = TypedRequestBody<{
  name: string
  location: string
  max_distance: number
  number_of_restaurants: number
  max_voters: number
  times_to_vote_on: {
    id: string
  }[]
  vote_on_time: boolean
  password: string
  restaurants: (Restaurant | CustomRestaurant)[]
  type: string
}>

export type FetchRestaurantsReq = TypedRequestBody<{
  location: string
  max_distance: number
  number_of_restaurants: number
  type: string
}>
