import StoreDB from "../model/Store.js";

const checkAdminStore = async (req, res) => {
  const { subdomain } = req.body;
  if (!subdomain)
    return res.status(400).json({ message: "subdomain is required" });
  // Check for duplicates
  const foundStore = await StoreDB.findOne({ adminUrl: subdomain }).exec();

  if (foundStore) {
    return res.status(200).json({ status: true });
  } else {
    return res.status(200).json({ status: false });
  }
};
export { checkAdminStore };
