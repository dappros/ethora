import { Response } from "express";
import Nfmt from "../db/models/nfmt";


export async function afterDeployHandler(req: any, res: Response) {
  const {id} = req.params
  const {address} = req.user

  const {contractAddress, splitPercents, costs, maxSupplies} = req.body

  let dbRecord = await Nfmt.findOne({creator: address, _id: id})

  if (!dbRecord) {
    return res.status(404).end()
  }

  dbRecord = await Nfmt.findOneAndUpdate({_id: dbRecord._id}, {
    contractAddress,
    splitPercents,
    costs,
    maxSupplies
  }, {new: true})

  return res.send(dbRecord)
}