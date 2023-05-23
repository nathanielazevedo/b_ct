import bcrypt from 'bcrypt';
import Party from '../models/Party.js';
import { likesToObj, getWinner, getRestaurants, makeVotesObjects, partyNotFound, } from './utils.js';
// Fetch Restaurants -> Restaurant[]
export const fetchRestaurants = async (req, res) => {
    try {
        const restaurants = await getRestaurants(req.body);
        if (restaurants?.data?.error) {
            const error = restaurants.data.error;
            return res.status(404).json({ message: error }).send();
        }
        else
            res.status(200).json(restaurants);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};
// Create Party -> party
export const createParty = async (req, res) => {
    try {
        const party = new Party({
            ...req.body,
            ...makeVotesObjects(req.body),
            password: await bcrypt.hash(req.body.password, 10),
            r_winner: null,
            t_winner: null,
            voters_so_far: 0,
        });
        res.status(200).json(await party.save());
    }
    catch (err) {
        res.status(409).json({ message: err.message });
    }
};
export const getParty = async (req, res) => {
    try {
        const party = await Party.findOne({ _id: req.params.id });
        if (!party)
            return partyNotFound(res);
        else
            res.status(200).json(party);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};
export const voteParty = async (req, res) => {
    const id = req.params.id;
    const { rLikes, tLikes } = req.body;
    try {
        const party = await Party.findOne({ _id: id });
        if (!party)
            return partyNotFound(res);
        else {
            const r_votes = likesToObj(rLikes, party.r_votes);
            const t_votes = tLikes ? likesToObj(tLikes, party.t_votes) : null;
            const voters_so_far = Number(party.voters_so_far) + 1;
            const info = { voters_so_far, r_votes, t_votes };
            if (voters_so_far === party.max_voters) {
                const vOT = party.vote_on_time;
                const tTVO = party.times_to_vote_on;
                const r_winner = getWinner(party.restaurants, party.r_votes);
                const t_winner = vOT ? getWinner(tTVO, party.t_votes).id : null;
                const w = { r_winner, t_winner };
                await Party.updateOne({ _id: id }, { ...w, ...info });
            }
            else {
                await Party.updateOne({ _id: id }, { voters_so_far, r_votes, t_votes });
            }
            const updatedParty = await Party.findOne({ _id: id });
            res.status(201).json(updatedParty);
        }
    }
    catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
};
export const validatePassword = async (req, res) => {
    try {
        const party = await Party.findOne({ _id: req.params.id });
        if (!party)
            return partyNotFound(res);
        else if (!party.password)
            return partyNotFound(res);
        else {
            bcrypt.compare(req.body.password, party.password, function (err, result) {
                if (result)
                    res.status(200).json({ message: 'success' });
                else
                    res.status(404).json({ message: 'incorrect password' });
            });
        }
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};
export const endParty = async (req, res) => {
    try {
        const party = await Party.findOne({ _id: req.params.id });
        if (!party)
            return partyNotFound(res);
        else {
            const r_winner = getWinner(party.restaurants, party.r_votes);
            const vOT = party.vote_on_time;
            const tTVO = party.times_to_vote_on;
            const t_winner = vOT ? getWinner(tTVO, party.t_votes).id : null;
            await Party.updateOne({ _id: req.params.id }, { r_winner, t_winner });
            const updatedParty = await Party.findOne({ _id: req.params.id });
            res.status(200).json(updatedParty);
        }
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};
