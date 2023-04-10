import { Schema, model, Document } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  profileImage: string;
  address: string;
  about: string;
  xmppPassword: string;
}

export interface IUserDocument extends IUser, Document {
}

const userSchema = new Schema<IUserDocument>(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    about: {
      type: String,
    },
    profileImage: {
      type: String
    },
    address: {
      type: String,
      required: true,
      unique: true
    },
    xmppPassword: String
  },
  {
    timestamps: true,
  }
)

export default model<IUserDocument>("User", userSchema);
