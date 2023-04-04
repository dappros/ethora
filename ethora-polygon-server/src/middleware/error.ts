import { NextFunction, Request, Response } from "express";

export default function (error: Error, req: Request, res: Response, next: NextFunction) {
  console.log('error handler')
  return res.status(500).send({error: error.message})
}