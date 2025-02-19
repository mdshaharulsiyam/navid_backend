import { Document } from "mongoose";

export interface IAuth extends Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    img: string;
    role: "ADMIN" | 'SUPER_ADMIN' | 'USER';
    block: boolean;
    provider: "GOOGLE" | "CREDENTIAL" | "FACEBOOK" | "GITHUB" | "APPLE"
    is_verified: boolean;
    accessToken: string;
    use_type: 'FREE' | "BASIC" | "PREMIUM",
    documents: string[];
    is_identity_verified: boolean,
    tax_id: string;
    date_of_birth: Date;
    createdAt: Date;
    updatedAt: Date;
}