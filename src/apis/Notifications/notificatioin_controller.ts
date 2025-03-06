import { Request, Response } from "express";
import { SearchKeys } from "../../utils/Queries";
import { HttpStatus } from "../../DefaultConfig/config";
import { sendResponse } from "../../utils/sendResponse";
import { notification_service } from "./notification_service";
import { IAuth } from "../Auth/auth_types";

async function get_all(req: Request, res: Response) {
  const { search, ...otherValues } = req?.query;
  const searchKeys: SearchKeys = {};

  if (search) searchKeys.name = search as string;

  const queryKeys = {
    ...otherValues,
  };

  if (req?.user?.role != "ADMIN" && req?.user?.role != "SUPER_ADMIN") {
    queryKeys.user = req?.user?._id as string;
  }

  const populatePath: string | string[] = "user";
  const selectFields: string | string[] = "name img _id";
  const modelSelect: string = "";

  const result = await notification_service.get_all(
    queryKeys,
    searchKeys,
    populatePath,
    selectFields,
    modelSelect,
  );
  sendResponse(res, HttpStatus.SUCCESS, result);
}

async function read(req: Request, res: Response) {
  const result = await notification_service.read_notification(
    req?.params?.id,
    req?.user as IAuth,
  );

  sendResponse(res, HttpStatus.SUCCESS, result);
}

export const notification_controller = Object.freeze({
  get_all,
  read,
});
