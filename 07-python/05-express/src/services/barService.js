import * as barModel from "../models/barModel.js";

export const listBars = async (keyword) => {
  return keyword ? await barModel.findByKeyword(keyword) : await barModel.findAll();
};
