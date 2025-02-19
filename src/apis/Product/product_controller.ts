import { Request, Response } from "express";
import { product_service } from "./product_service";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatus } from "../../DefaultConfig/config";
import { UnlinkFiles } from "../../middleware/fileUploader";
import { QueryKeys } from "../../utils/Aggregator";

const create = async function (req: Request, res: Response) {

    const data = req.body

    const variants_formate = product_service.formate_variant(req)

    if (variants_formate && variants_formate?.length > 0) data.variants = variants_formate

    data.user = req?.user?._id

    const result = await product_service.create(data)

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )

}

const get_all = async function (req: Request, res: Response) {
    const { search, whole_sale, ...other_fields } = req.query

    const populatePath = ['category', 'subCategory', 'user'];
    const selectFields = ['_id name', '_id name', '_id'];

    let searchKeys = {} as { name: string }

    let queryKeys = { ...other_fields } as QueryKeys

    if (search) searchKeys.name = search as string

    if (req?.user?.tax_id && whole_sale) {
        queryKeys.whole_sale = true
    }
    const result = await product_service.get_all(queryKeys, searchKeys);

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

const get_product_details = async function (req: Request, res: Response) {

    const result = await product_service.get_details(req?.params?.id)
    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

const update = async function (req: Request, res: Response) {

    const { retained_variants: prev, deleted_variants: del, ...data } = req.body;

    const retained_variants = JSON.parse(prev)
    const deleted_variants = JSON.parse(del)


    const variants_formate = product_service.formate_variant(req)


    const merge_variants = product_service.merge_variants(retained_variants, variants_formate)

    if (deleted_variants && deleted_variants.length > 0) {
        UnlinkFiles(deleted_variants);
    }

    const result = await product_service.update_product(req?.params?.id, { ...data, variants: merge_variants })

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}


const delete_product = async function (req: Request, res: Response) {

    const result = await product_service.delete_product(req?.params?.id)

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

const approve_product = async function (req: Request, res: Response) {

    const result = await product_service.approve_product(req?.params?.id)

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

const feature_product = async function (req: Request, res: Response) {

    const result = await product_service.feature_product(req?.params?.id)

    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

export const product_controller = Object.freeze({
    create,
    get_all,
    get_product_details,
    update,
    delete_product,
    approve_product,
    feature_product
})