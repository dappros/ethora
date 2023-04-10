import mongoose from 'mongoose'
import config from '../config'

function dbConnect() {
  return mongoose.connect(config.mongoUri)
}

export default dbConnect