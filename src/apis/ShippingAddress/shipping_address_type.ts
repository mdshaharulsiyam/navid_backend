import { Document, Types } from 'mongoose';

interface IShippingAddress extends Document {
    user: Types.ObjectId;
    name: string;
    phone: string;
    address: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export default IShippingAddress;
