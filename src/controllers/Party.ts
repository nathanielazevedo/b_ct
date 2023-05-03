import Party from "../models/Party";

/* READ */
export const getParty = async (req: any, res: any) => {
  try {
    const post = await Party.find();
    res.status(201).json(post);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};
