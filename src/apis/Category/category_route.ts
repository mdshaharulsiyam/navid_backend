import express from "express";
import asyncWrapper from "../../middleware/asyncWrapper";
import { category_controller } from "./category_controller";
import verifyToken from "../../middleware/verifyToken";
import config from "../../DefaultConfig/config";
import uploadFile from "../../middleware/fileUploader";

export const category_router = express.Router();

category_router
  .post(
    "/category/create",
    verifyToken(config.ADMIN),
    uploadFile(),
    asyncWrapper(category_controller.create),
  )

  .get("/category/get-all", asyncWrapper(category_controller.get_all))

  .patch(
    "/category/update/:id",
    verifyToken(config.ADMIN),
    uploadFile(),
    asyncWrapper(category_controller.update),
  )

  .delete(
    "/category/delete/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(category_controller.delete_category),
  );
