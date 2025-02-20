import { setting_model } from "./setting_model";
import { ISetting } from "./setting_type";

async function create(data: ISetting) {
    const result = await setting_model.findOneAndUpdate({ name: data?.name }, { desc: data?.desc }, { new: true, upsert: true })

    return { success: true, message: `${data?.name} updated successfully` }

}

async function get(name: string) {
    const result = await setting_model.findOne({ name }).select('-_id name desc').lean()
    if (result) {
        return {
            success: true, message: `${name} retrieve successfully`, data: { ...result }
        }
    } else {
        return {
            success: true, message: `${name} retrieve successfully`, data: { name: name, desc: '' }
        }
    }
}
export const setting_service = Object.freeze({
    create,
    get
})
