import path from "path";
import { Response } from "express";
import Joi from "joi";
import fs from "fs";
import generatePassword from 'generate-password'

import { pinata } from "../services/pinata";
import config from "../config";

import User from "../db/models/user";
import { registerXmppuser } from "../utils/xmpp";

const bodySchemaUpdate = Joi.object({
  firstName: Joi.string().optional().min(3).max(25),
  lastName: Joi.string().optional().min(3).max(25),
  about: Joi.string().optional().min(10).max(255),
}).required();

const bodySchemaCreate = Joi.object({
  firstName: Joi.string().min(3).max(25).required(),
  lastName: Joi.string().optional().min(3).max(25).required(),
  about: Joi.string().optional().min(10).max(255),
}).required();

export async function updateProfile(req: any, res: Response) {
  const { address } = req.user;
  let dbUser = await User.findOne({ address });

  if (dbUser) {
    const error = bodySchemaUpdate.validate(req.body).error;

    if (error) {
      return res.status(422).send({ error });
    }
  }

  if (!dbUser) {
    const error = bodySchemaCreate.validate(req.body).error;

    if (error) {
      return res.status(422).send({ error });
    }
  }

  if (req.file) {
    if (req.file.mimetype.split("/")[0] !== "image") {
      return res.status(422).send({ error: "only image files acceptable" });
    }
  }

  let ipfsImageLink;

  if (req.file) {
    try {
      const rs = fs.createReadStream(path.resolve(req.file.path));
      const ipfsRes = await pinata.pinFileToIPFS(rs, {
        pinataMetadata: { name: req.file.originalname },
      });

      ipfsImageLink = config.pinataGateway + ipfsRes.IpfsHash;
    } catch (error) {
      console.log(error);
    }
  }

  let userData = {
    ...req.body,
    address,
  };

  if (ipfsImageLink) {
    userData.profileImage = ipfsImageLink;
  }

  if (!dbUser) {
    const xmppPassword = generatePassword.generate({
      length: 10,
      numbers: true
    })

    try {
      const xmppResult = await registerXmppuser(address, xmppPassword)
    } catch (error) {

    }
    
    userData.xmppPassword = xmppPassword
    const user = await User.create(userData);
    return res.status(200).send(user);
  } else {
    const user = await User.updateOne({ address }, userData, { new: true });
    return res.status(204).send(user);
  }
}
