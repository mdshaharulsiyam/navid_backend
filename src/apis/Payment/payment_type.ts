import { Document, Types } from "mongoose";

export interface IPayment extends Document {
    purpose: string;
    session_id: string;
    transaction_id: string;
    order: Types.ObjectId[]
    status: boolean,
    user: Types.ObjectId,
    pay_by: string;
    amount: number;
    refund: string,
    currency: string
}