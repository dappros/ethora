import { Schema, model, Document } from "mongoose";

export interface INfmt {
  name: string;
  symbol: string;
  contractAddress: string;
  description: string;
  urls: string[];
  costs: string[];
  images: string[];
  splitPercents: string[],
  maxSupplies: string[],
  beneficiaries: string[],
  creator: string,
}

export interface INfmtDocument extends INfmt, Document {
}

const nfmtSchema = new Schema<INfmtDocument>(
  {
    name: String,
    description: String,
    symbol: String,
    contractAddress: {
      type: String,
    },
    urls: [String],
    costs: [String],
    splitPercents: [String],
    maxSupplies: [String],
    images: [String],
    beneficiaries: [String],
    creator: String,
  },
  {
    timestamps: true,
  }
)

export default model<INfmtDocument>("Nfmt", nfmtSchema);
