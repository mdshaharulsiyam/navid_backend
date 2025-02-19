import express from "express";
import asyncWrapper from "../../middleware/asyncWrapper";
import verifyToken from "../../middleware/verifyToken";
import config from "../../DefaultConfig/config";
import { business_controller } from "./business_controller";
export const business_router = express.Router();

business_router
    .post(
        '/business/create',
        verifyToken(config.USER),
        asyncWrapper(business_controller.create)
    )

    .get(
        '/business/get-all',
        asyncWrapper(business_controller.get_all)
    )

    .patch(
        '/business/update/:id',
        verifyToken(config.USER),
        asyncWrapper(business_controller.update)
    )

    .delete(
        '/business/delete/:id',
        verifyToken(config.ADMIN),
        asyncWrapper(business_controller.delete_business)
    )

    .patch(
        '/business/approve/:id',
        verifyToken(config.ADMIN),
        asyncWrapper(business_controller.approve_shop)
    )

    .patch(
        '/business/block/:id',
        verifyToken(config.ADMIN),
        asyncWrapper(business_controller.block_shop)
    )
