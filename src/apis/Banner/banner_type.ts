import { Document } from "mongoose";

export interface IBanner extends Document {
  img: string;
  link: string;
  is_active: boolean;
  link_web: string;
  start_date: Date;
  end_date: Date;
}
