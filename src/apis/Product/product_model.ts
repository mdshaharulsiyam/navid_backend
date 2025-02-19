import { Schema, model } from 'mongoose';
import IProduct, { IVariant } from './product_type';

const variants_schema = new Schema<IVariant>({
    img: {
        type: [String],
        required: [true, 'image is missing for some variants']
    },
    color: {
        type: String,
        default: "no_variants"
    }

}, { _id: false })

const product_schema = new Schema<IProduct>(
    {
        name: { type: String, required: [true, 'Product Name is required'], unique: true },
        description: { type: String, required: [true, 'Description is required'] },
        price: { type: Number, required: [true, 'Price is required'] },
        category: { type: Schema.Types.ObjectId, ref: 'category', required: [true, 'Category is required'] },
        user: { type: Schema.Types.ObjectId, ref: 'auth', required: [true, 'user is required'] },
        whole_sale: {
            type: Boolean,
            default: false
        },
        quantity: {
            type: Number,
            default: 0
        },
        variants: {
            type: [variants_schema],
            required: [true, 'image is required']
        }
    },
    { timestamps: true }
);

export const product_model = model<IProduct>('product', product_schema);
