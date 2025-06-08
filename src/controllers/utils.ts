import yelp from 'api'

import * as dotenv from 'dotenv'
import { TypedRequestBody } from '../interfaces/Request.js'
import { CustomRestaurant, Restaurant } from '../interfaces/Restaurant.js'

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
  price?: string // "1", "2", "3", "4", or "0" (which we'll treat as no limit)
}) => {
  const { location, max_distance, number_of_restaurants, type, price } = info

  try {
    sdk.auth(`Bearer ${yelpKey}`)

    const query: any = {
      location,
      term: type,
      radius: max_distance,
      sort_by: 'best_match',
      limit: number_of_restaurants,
    }

    // Only include price if it's not 0 (i.e. "No Limit")
    if (price && price !== '0') {
      const maxPrice = parseInt(price, 10)
      query.price = Array.from({ length: maxPrice }, (_, i) => i + 1).join(',')
    }


    return sdk
      .v3_business_search(query)
      .then(({ data }: any) => {
        return data.businesses
      })
      .catch((err: any) => {
        console.log(err)
        return err
      })
  } catch (err: any) {
    throw new Error(err)
  }
}

export const partyNotFound = (res: any) => {
  return res.status(403).send()
}

export const makeVotesObjects = (data: {
  restaurants: (Restaurant | CustomRestaurant)[]
  hours_to_vote_on: { id: string }[]
  days_to_vote_on: { id: string }[]
}) => {
  const r_votes = {} as { [key: string]: number }
  const h_votes = {} as { [key: string]: number }
  const d_votes = {} as { [key: string]: number }
  data.restaurants.forEach((restaurant) => (r_votes[restaurant.id] = 0))
  data.hours_to_vote_on.forEach((hour) => (h_votes[hour.id] = 0))
  data.days_to_vote_on.forEach((day) => (d_votes[day.id] = 0))
  return { r_votes, h_votes, d_votes }
}

export type CreatePartyReq = TypedRequestBody<{
  name: string
  location: string
  max_distance: number
  number_of_restaurants: number
  max_voters: number
  hours_to_vote_on: {
    id: string
  }[]
  days_to_vote_on: {
    id: string
  }[]
  vote_on_hours: boolean
  vote_on_days: boolean
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
