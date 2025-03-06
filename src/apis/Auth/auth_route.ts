import express from "express";
import asyncWrapper from "../../middleware/asyncWrapper";
import { auth_controller } from "./auth_controller";
import verifyToken from "../../middleware/verifyToken";
import config from "../../DefaultConfig/config";
import uploadFile from "../../middleware/fileUploader";
import rateLimit from "express-rate-limit";
export const auth_router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 4,
  handler: (req, res) => {
    // console.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).send({
      success: false,
      message: "Too many requests please try after 1 hour",
    });
  },
});

auth_router
  .post(
    "/auth/sign-up",
    verifyToken(config.USER, false),
    asyncWrapper(auth_controller.create),
  )

  .post("/auth/sign-in", asyncWrapper(auth_controller.sing_in))

  .post(
    "/auth/reset-password",
    verifyToken(config.USER, true, config.ACCESS_TOKEN_NAME),
    asyncWrapper(auth_controller.reset_password),
  )

  .post(
    "/auth/change-password",
    verifyToken(config.USER),
    asyncWrapper(auth_controller.change_password),
  )

  .patch(
    "/auth/update-profile",
    verifyToken(config.USER),
    uploadFile(),
    asyncWrapper(auth_controller.update_auth),
  )

  .get(
    "/auth/profile",
    verifyToken(config.USER),
    asyncWrapper(auth_controller.get_profile),
  )

  .post("/auth/logout", asyncWrapper(auth_controller.sing_out))

  .patch(
    "/auth/verify-identity/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(auth_controller.verify_identity),
  )

  .patch(
    "/auth/block/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(auth_controller.block_auth),
  )

  .get(
    "/auth/get-all",
    verifyToken(config.ADMIN),
    asyncWrapper(auth_controller.get_all),
  );
