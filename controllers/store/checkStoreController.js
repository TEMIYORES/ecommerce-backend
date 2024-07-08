import StoreDB from "../../model/Store.js";

const checkStore = async (req, res) => {
  const { subdomain } = req.params;
  console.log({ subdomain });
  if (!subdomain)
    return res.status(400).json({ message: "subdomain is required" });

  // Check for store
  const store = subdomain[0].toUpperCase() + subdomain.substring(1);
  try {
    const foundStore = await StoreDB.findOne({ storeName: store }).exec();
    console.log({ foundStore });
    if (foundStore) {
      return res
        .status(200)
        .json({ id: foundStore._id, storeName: foundStore.storeName });
    } else {
      return res.status(400).json({ message: "No store with subdomain" });
    }
  } catch (err) {
    console.log(err.message);
  }
};
export { checkStore };
