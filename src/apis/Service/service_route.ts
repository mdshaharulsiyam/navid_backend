import express from "express";
import asyncWrapper from "../../middleware/asyncWrapper";
import verifyToken from "../../middleware/verifyToken";
import config from "../../DefaultConfig/config";
import { category_controller } from "./service_controller";
import uploadFile from "../../middleware/fileUploader";

export const service_router = express.Router();

service_router
  .post(
    "/service/create",
    verifyToken(config.ADMIN),
    uploadFile(),
    asyncWrapper(category_controller.create),
  )

  .get("/service/get-all", asyncWrapper(category_controller.get_all))

  .patch(
    "/service/update/:id",
    verifyToken(config.ADMIN),
    uploadFile(),
    asyncWrapper(category_controller.update),
  )

  .delete(
    "/service/delete/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(category_controller.delete_service),
  );
