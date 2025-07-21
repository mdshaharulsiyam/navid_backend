import { Document, Types } from "mongoose";

export interface IVariant {
  img: string[];
  color: string;
}

interface IProduct extends Document {
  name: string;
  description: string;
  price: Number;
  variants: IVariant[];
  category: Types.ObjectId;
  sub_category: Types.ObjectId;
  user: Types.ObjectId;
  whole_sale: boolean;
  quantity: number;
  created_at?: Date;
  updated_at?: Date;
  previous_price: Number;
}

export default IProduct;
