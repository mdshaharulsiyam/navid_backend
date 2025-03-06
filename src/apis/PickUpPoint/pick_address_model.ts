import { Schema, model } from "mongoose";
import IPickAddress from "./pick_address_type";

const pick_address_schema = new Schema<IPickAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "auth",
      required: true,
    },
    address: {
      type: String,
      required: [true, "Street is required"],
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "phone number is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
  },
  { timestamps: true },
);

export const pick_address_model = model<IPickAddress>(
  "pick_address",
  pick_address_schema,
);
