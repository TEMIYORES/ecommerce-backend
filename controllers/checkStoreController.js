import StoreDB from "../model/Store.js";

const checkStore = async (req, res) => {
  const { subdomain } = req.body;
  if (!subdomain)
    return res.status(400).json({ message: "subdomain is required" });

  // Check for store
  const store = subdomain[0].toUpperCase() + subdomain.substring(1);
  const foundStore = await StoreDB.findOne({ storeName: store }).exec();
  if (foundStore) {
    return res.status(200).json({ id: foundStore._id });
  } else {
    return res.status(200).json({ id: foundStore._id });
  }
};
export { checkStore };
