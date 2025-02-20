import mongoose, { Types } from "mongoose";
import { IOrder, IOrderItem } from "./order_type";
import { order_model } from "./order_model";
import { cart_model } from "../Cart/cart_model";
import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries";


const create_order = async (data: any, user_id: string) => {
    const session = await mongoose.startSession();
    try {
        const result = await session.withTransaction(async () => {
            const { items, total_amount, delivery_address, payment_method } = data;

            const product_ids = items.map((item: IOrderItem) => item.product);

            const order_data = {
                user: user_id,
                items,
                total_amount,
                delivery_address,
                payment_method,
            } as { [key: string]: any };


            const [order, updated_cart] = await Promise.all([
                order_model.insertMany([order_data], { session }),
                cart_model.findOneAndUpdate(
                    { user: user_id },
                    { $pull: { items: { product_id: { $in: product_ids } } } },
                    { session, new: true }
                )
            ])

            if (updated_cart) {
                const total_quantity = updated_cart.items.reduce((acc, item) => acc + item.quantity, 0);
                const total_price = updated_cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

                await cart_model.findOneAndUpdate(
                    { user: user_id },
                    {
                        $set: {
                            total_quantity,
                            total_price
                        }
                    },
                    { session, new: true }
                );
            }
            return {
                success: true,
                message: 'order created successfully',
                data: order
            }

        })
        return result
    } catch (error) {
        throw error
    } finally {
        session.endSession();
    }
}

const get_all = async (queryKeys: QueryKeys, searchKeys: SearchKeys, populatePath?: any, selectFields?: string | string[], modelSelect?: string) => {
    return await Queries(order_model, queryKeys, searchKeys, populatePath, selectFields, modelSelect);
}

const get_order_details = async (id: string) => {

    const order_details = await order_model.findById(id)
        .populate({
            path: 'user',
            select: 'name email img',
        })
        .populate({
            path: 'items.product',
            select: 'name price img',
        })
        .populate({
            path: 'delivery_address',
            select: 'name phone address',
        })
    return {
        success: true,
        message: 'order data retrieved successfully',
        data: order_details
    }
}

const update_order = async (id: string, data: IOrder) => {
    const { estimated_delivery_date, delivered_at, canceled_at } = data
    if (
        (estimated_delivery_date && new Date(estimated_delivery_date?.toString() as string) < new Date())
        || (delivered_at && new Date(delivered_at?.toString() as string) < new Date())
        || (canceled_at && new Date(canceled_at?.toString() as string) < new Date())
    ) {
        throw new Error('invalid date ')
    }
    const updated_order = await order_model.findByIdAndUpdate(id, data, { new: true });

    if (!updated_order) throw new Error('Order not found');

    return {
        success: true,
        message: 'Order updated successfully',
        data: updated_order
    };

}

const delete_order = async (id: string) => {

    const deleted_order = await order_model.findByIdAndDelete(id);

    if (!deleted_order) throw new Error('Order not found');

    return {
        success: true,
        message: 'Order deleted successfully',
        data: deleted_order
    };
}

const update_delivery_status = async (id: string, delivery_status: string) => {

    const updated_order = await order_model.findByIdAndUpdate(id, { delivery_status }, { new: true });

    if (!updated_order) throw new Error('Order not found');

    return {
        success: true,
        message: 'Order updated successfully',
        data: updated_order
    };
}

export const order_service = Object.freeze({
    create_order,
    get_all,
    get_order_details,
    update_order,
    delete_order,
    update_delivery_status
})