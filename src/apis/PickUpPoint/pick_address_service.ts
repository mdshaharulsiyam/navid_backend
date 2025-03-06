import { pick_address_model } from "./pick_address_model";
import IShippingAddress from "./pick_address_type";

const create = async function (data: IShippingAddress) {
  const result = await pick_address_model.create(data);
  return {
    success: true,
    message: "pick up address created successfully",
    data: result,
  };
};

const get_all = async function (id: string) {
  const result = await pick_address_model.find();

  return {
    success: true,
    message: "pick up address retrieve successfully",
    data: result,
  };
};

const get_near_by_address = async function (
  longitude: string,
  latitude: string,
  distance: string = "5000",
) {
  const addresses = await pick_address_model.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: parseInt(distance), // Distance in meters
      },
    },
  });

  return {
    success: true,
    message: "pick up address retrieve successfully",
    data: addresses,
  };
};

const update = async function (
  id: string,
  user: string,
  data: IShippingAddress,
) {
  const result = await pick_address_model.findOneAndUpdate(
    { _id: id, user },
    {
      $set: {
        ...data,
      },
    },
    { new: true },
  );

  return {
    success: true,
    message: "pick up address updated successfully",
    data: result,
  };
};

const delete_shipping_address = async function (id: string, user: string) {
  const result = await pick_address_model.findOneAndDelete({
    _id: id,
    user: user,
  });

  return {
    success: true,
    message: "pick up address deleted successfully",
    data: result,
  };
};

export const pick_address_service = Object.freeze({
  create,
  get_all,
  get_near_by_address,
  update,
  delete_shipping_address,
});
