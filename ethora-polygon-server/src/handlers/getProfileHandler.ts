import { Request, Response } from "express";
import User from "../db/models/user";

export async function getProfileHandler(req: Request, res: Response) {
  const { address } = req.params;
  const user = await User.findOne({ address });

  if (!user) {
    return res.status(404).end();
  }

  const { _id, firstName, lastName, profileImage } = user.toObject();

  return res.send({
    _id,
    firstName,
    lastName,
    profileImage,
  });
}
