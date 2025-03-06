import express from "express";
import asyncWrapper from "../../middleware/asyncWrapper";
import verifyToken from "../../middleware/verifyToken";
import config from "../../DefaultConfig/config";
import { pick_address_controller } from "./pick_address_controller";

export const pick_address_router = express.Router();

pick_address_router
  .post(
    "/pick-address/create",
    verifyToken(config.ADMIN),
    asyncWrapper(pick_address_controller.create),
  )

  .get(
    "/pick-address/get-all",
    verifyToken(config.USER),
    asyncWrapper(pick_address_controller.get_all),
  )

  .delete(
    "/pick-address/delete/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(pick_address_controller.delete_shipping_address),
  )

  .patch(
    "/pick-address/update/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(pick_address_controller.update),
  );
