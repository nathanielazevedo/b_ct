import { Restaurant } from './Restaurant.js'

export type PartyType = {
  _id: string
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
  restaurants: Restaurant[]
  r_votes: {
    [id: string]: number
  }
  h_votes: {
    [id: string]: number
  }
  d_votes: {
    [id: string]: number
  }
  r_winner: Restaurant | null
  h_winner: string | null
  d_winner: string | null
  createdAt: string
  updatedAt: string
  voters_so_far: number
  __v: number
  type: string
}
