import mongoose from "mongoose";
import { IPaymentData } from "../../types/data_types";
import { payment_model } from "./payment_model";
import auth_model from "../Auth/auth_model";
import config from "../../DefaultConfig/config";
import { notification_model } from "../Notifications/notification_model";
import { stripe } from "./payment_controller";
import { currency_list_code } from "../../utils/stripe/stripe_currency";
import { country_list_code } from "../../utils/stripe/strupe_country";
import { Request } from "express";
import { IAuth } from "../Auth/auth_types";
import bcrypt from "bcrypt";
import { product_model } from "../Product/product_model";
import { order_model } from "../Order/order_model";

async function validate_stripe_country_currency(
  country_currency: string,
  type: "currency" | "country",
) {
  if (type === "currency") {
    return currency_list_code.includes(country_currency);
  } else {
    return country_list_code.includes(country_currency);
  }
}

async function calculate_amount(price_data: IPaymentData[]) {
  return price_data
    ? price_data.reduce((total, item) => {
        const unitAmount = Number(item.unit_amount) ?? 0;
        const quantity = Number(item.quantity) ?? 1;
        return total + unitAmount * quantity;
      }, 0)
    : 0;
}

async function create(data: any) {
  await payment_model.insertMany(data);
  return {
    success: true,
    message: "payment created successfully",
  };
}

async function success_payment(
  data: { status: boolean; transaction_id: string },
  session_id: string,
) {
  const session = await mongoose.startSession();
  try {
    const result = await session.withTransaction(async () => {
      const is_exists_payment = await payment_model
        .findOne({ session_id })
        .lean();

      if (!is_exists_payment) throw new Error(`payment not found`);

      const [result] = await Promise.all([
        payment_model.findByIdAndUpdate(
          is_exists_payment?._id,
          {
            $set: {
              ...data,
            },
          },
          { session },
        ),

        order_model.updateMany(
          { _id: { $in: is_exists_payment?.order } },
          { payment_status: "paid" },
        ),

        notification_model.insertMany(
          [
            {
              user: is_exists_payment?.user,
              title: "payment success",
              message: `payment of $${is_exists_payment?.amount} is success`,
            },
          ],
          { session },
        ),
      ]);
      return result;
    });
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
}

async function refund(
  payment_intent: string,
  user_password: string,
  inserted_password: string,
  amount?: string | number,
) {
  const is_match_pass = await bcrypt.compare(user_password, inserted_password);

  if (!is_match_pass) throw new Error(`invalid credentials`);

  const refund = await stripe.refunds.create({
    payment_intent: payment_intent,
    ...(amount && { amount: Number(amount) }),
  });

  if (refund?.id) {
    await payment_model.updateOne(
      { transaction_id: payment_intent },
      { $set: { refund: refund?.id } },
    );
    return {
      success: true,
      message: "refund success",
    };
  } else {
    return {
      success: false,
      message: "refund failed",
    };
  }
}

async function update_account_onboarding(id: string, req: Request) {
  const onboarding_link = await stripe.accountLinks.create({
    account: id,
    refresh_url: `${req.protocol + "://" + req.get("host")}/payment/refresh_account_connect/${id}`,
    return_url: `${req.protocol + "://" + req.get("host")}/payment/success-account/${id}`,
    type: "account_onboarding",
  });
  return onboarding_link?.url;
}

async function create_account(email: string, country: string) {
  const account = await stripe.accounts.create({
    type: "express",
    email: email ?? "example@gmail.com",
    country: country ?? "US",
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  return account?.id;
}

async function transfer_balance(
  account_id: string,
  amount: number,
  currency?: string,
) {
  if (currency) {
    const is_valid = await payment_service.validate_stripe_country_currency(
      currency,
      "currency",
    );
    if (!is_valid) throw new Error(`invalid currency`);
  }

  const transfer = await stripe.transfers.create({
    amount: amount,
    currency: currency ?? "usd",
    destination: account_id,
  });

  if (!transfer?.id) throw new Error("transfer failed");

  return { success: true, message: `balance transferred successfully` };
}

async function check_payment_status(id: string) {
  const session = await stripe.checkout.sessions.retrieve(id);
  const payment_intent = session?.payment_intent;

  const payment_intent_retrieve = await stripe.paymentIntents.retrieve(
    payment_intent as string,
  );

  if (
    !payment_intent_retrieve ||
    payment_intent_retrieve.amount_received === 0
  ) {
    throw new Error("Payment Not Succeeded");
  }
  await payment_model.updateOne({ session_id: id }, { $set: { status: true } });

  return {
    success: true,
    message: "payment success",
  };
}

async function validate_transfer_balance(
  user: IAuth,
  data: { [key: string]: string | number },
) {
  const is_match_pass = await bcrypt.compare(
    data?.password as string,
    user?.password,
  );

  if (!is_match_pass) throw new Error(`invalid credentials`);

  const result = await auth_model.findById(data?.id);

  if (!result) throw new Error(`user not found`);

  // if (!result?.stripe?.stripe_account_id) throw new Error(`stripe account not created`)

  // if (!result?.stripe?.is_account_complete) throw new Error(`stripe account not completed`)

  return "result?.stripe?.stripe_account_id";
}

export const payment_service = Object.freeze({
  create,
  calculate_amount,
  success_payment,
  validate_stripe_country_currency,
  update_account_onboarding,
  create_account,
  check_payment_status,
  transfer_balance,
  refund,
  validate_transfer_balance,
});
