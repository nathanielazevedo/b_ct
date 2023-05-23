import { Restaurant } from './Restaurant'

export type PartyType = {
  _id: string
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
  restaurants: Restaurant[]
  r_votes: {
    [id: string]: number
  }
  t_votes: {
    [id: string]: number
  }
  r_winner: Restaurant | null
  t_winner: string | null
  createdAt: string
  updatedAt: string
  voters_so_far: number
  __v: number
  type: string
}
