import Store from "../../model/Store.js";

const getStore = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  //   Check if id is passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check if it exists
  const foundStore = await Store.findOne({ _id: id }).exec();
  if (!foundStore)
    return res.status(400).json({ message: `No Store with the StoreId` });
  res.status(200).json({
    storeName: foundStore?.storeName,
    username: foundStore?.username,
    email: foundStore.email,
  });
};

export { getStore };
