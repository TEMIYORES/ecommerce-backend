import StoreDB from "../model/Store.js";
const getAllStore = async (req, res) => {
  const allStore = await StoreDB.find();
  if (!allStore) return res.status(204).json({ message: "No Store found." });
  res.status(200).json(allStore);
};

const deleteStore = async (req, res) => {
  const { id } = req.body;
  //   Check if Storename and password are passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check for duplicates
  const foundStore = await StoreDB.findOne({ _id: id }).exec();
  if (!foundStore)
    res.status(204).json({ message: `No Store with StoreId ${id}` });
  const result = await StoreDB.deleteOne({ _id: id });
  res.status(200).json(result);
};
const getStore = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  //   Check if id is passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check if it exists
  const foundStore = await StoreDB.findOne({ _id: id }).exec();
  if (!foundStore)
    return res.status(400).json({ message: `No Store with the StoreId` });
  res.status(200).json({
    storeName: foundStore?.storeName,
    username: foundStore?.username,
    email: foundStore.email,
  });
};

export { getAllStore, deleteStore, getStore };
