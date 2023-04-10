import fs from "fs";
import path from "path";

import { Response } from "express";
import { pinata } from "../services/pinata";
import Joi from "joi";
import Nfmt from "../db/models/nfmt";

import config from "../config";

// const bodySchema = Joi.object({
//   costs: Joi.array().items(Joi.number().integer().min(1)),
//   maxSupplies: Joi.array().items(Joi.number().integer().min(1)),
//   beneficiaries: Joi.array().items(Joi.custom((value, helpers) => {
//     if (!Web3.utils.isAddress(value)) {
//       return helpers.error('any.invalid')
//     } else {
//       return true
//     }
//   })).required()
// }).required();

const bodySchema = Joi.object({
  collectionName: Joi.string().required(),
  collectionDescription: Joi.string().required()
}).required();

export async function preDeployNfmtHandler(req: any, res: Response) {
  try {
    // validations start
    const error = bodySchema.validate(req.body).error;

    if (error) {
      return res.status(422).send({ error });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(422)
        .send({ error: "should at least one file with image type" });
    }

    for (const file of req.files) {
      if (file.mimetype.split("/")[0] !== "image") {
        return res.status(422).send({ error: "only image files acceptable" });
      }
    }
    // validations end

    const { collectionName, collectionDescription } = req.body;

    let imagesIpfsLinks: string[] = [];

    for (const file of req.files) {
      const rs = fs.createReadStream(path.resolve(file.path));
      let ipfsUploadResult;

      try {
        ipfsUploadResult = await pinata.pinFileToIPFS(rs, {
          pinataMetadata: { name: file.originalname },
        });
      } catch (error) {
        console.log(error);
      }

      const hash = ipfsUploadResult?.IpfsHash;
      const ipfsUrl = config.pinataGateway + hash;
      imagesIpfsLinks.push(ipfsUrl);
    }

    let metadataUrls: string[] = [];

    for (const [index, imageLink] of imagesIpfsLinks.entries()) {
      const metadata = {
        name: `${collectionName} #${index + 1}`,
        image: imageLink,
        description: collectionDescription,
      };

      const res = await pinata.pinJSONToIPFS(metadata, {
        pinataMetadata: {
          name: `${collectionName} #${index + 1} ${Date.now()}`,
        },
      });
      const hash = res?.IpfsHash;
      const ipfsUrl = config.pinataGateway + hash;
      metadataUrls.push(ipfsUrl);
    }

    const dbRecord = await Nfmt.create({
      creator: req.user.address,
      urls: metadataUrls,
      images: imagesIpfsLinks,
      description: collectionDescription,
      name: collectionName
    })

    return res.send({ ok: true, imagesIpfsLinks, metadataUrls, _id: dbRecord._id });
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
}
