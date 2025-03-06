import express from "express";
import asyncWrapper from "../../middleware/asyncWrapper";
import { setting_controller } from "./setting_controller";
import verifyToken from "../../middleware/verifyToken";
import config from "../../DefaultConfig/config";

export const setting_router = express.Router();

setting_router
  .get("/setting/:name", asyncWrapper(setting_controller.get))

  .patch(
    "/setting/create",
    verifyToken(config.ADMIN),
    asyncWrapper(setting_controller.create),
  );
