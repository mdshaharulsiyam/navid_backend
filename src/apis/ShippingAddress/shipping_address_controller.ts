import { shipping_address_service } from './shipping_address_service';
import { sendResponse } from "../../utils/sendResponse"
import { Request, Response } from 'express';
import { HttpStatus } from '../../DefaultConfig/config';

const create = async (req: Request, res: Response) => {

    req.body.user = req?.user?._id
    const result = await shipping_address_service.create(req?.body)

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

const get_all = async (req: Request, res: Response) => {

    const result = await shipping_address_service.get_all(req?.user?._id as string)

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

const update = async (req: Request, res: Response) => {

    const result = await shipping_address_service.update(req?.params?.id, req?.user?._id as string, req?.body)

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

const delete_shipping_address = async (req: Request, res: Response) => {

    const result = await shipping_address_service.delete_shipping_address(req?.params?.id, req?.user?._id as string)

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

export const shipping_address_controller = {
    create,
    get_all,
    update,
    delete_shipping_address
}