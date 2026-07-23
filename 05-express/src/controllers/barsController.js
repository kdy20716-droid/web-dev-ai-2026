import * as barService from "../services/barService.js";

export const getBars = async (req, res) => {
  const keyword = req.query.keyword;
  const bars = await barService.listBars(keyword);
  res.status(200).json(bars);
};
