import { Document, Types } from "mongoose";

interface IPickAddress extends Document {
  user: Types.ObjectId;
  name: string;
  phone: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default IPickAddress;
