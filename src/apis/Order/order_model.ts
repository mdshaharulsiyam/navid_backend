import { Schema, model } from 'mongoose';
import { IOrder } from './order_type';

const order_schema = new Schema<IOrder>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'auth',
        required: [true, 'Customer reference is required']
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: [true, 'Product is required']
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: 1
        },
        color: {
            type: String,
            default: null
        }
    }],
    total_amount: {
        type: Number,
        required: [true, 'Total amount is required']
    },

    payment_status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    payment_method: {
        type: String,
        enum: ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
        default: 'cash_on_delivery'
    },
    delivery_status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'canceled', 'returned'],
        default: 'pending'
    },
    delivery_address: {
        type: Schema.Types.ObjectId,
        ref: "shipping_address",
        required: [true, 'Shipping address is required']
    },

    estimated_delivery_date: {
        type: Date
    },
    delivered_at: {
        type: Date
    },
    canceled_at: {
        type: Date
    },
    notes: {
        type: String,
    }
}, { timestamps: true });

export const order_model = model<IOrder>('order', order_schema);
