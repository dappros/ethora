import mongoose from "mongoose";

const url = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;

export const connectToDb = async () => {
    return mongoose.connect(url, {useNewUrlParser: true});
}