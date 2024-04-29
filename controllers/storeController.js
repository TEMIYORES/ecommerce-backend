import StoreDB from "../model/Store.js";
import bcrypt from "bcrypt";
const getAllStore = async (req, res) => {
  const allStore = await StoreDB.find();
  if (!allStore) return res.status(204).json({ message: "No Store found." });
  res.status(200).json(allStore);
};

const updateStore = async (req, res) => {
  const { id, storeName, password } = req.body;
  //   Check if Storename and password are passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check for duplicates
  const foundStore = await StoreDB.findOne({ _id: id }).exec();
  if (!foundStore)
    res.status(204).json({ message: `No Store with StoreId ${id}` });
  try {
    if (storeName) foundStore.storeName = storeName;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      foundStore.password = hashedPassword;
    }
    const result = await foundStore.save();
    res.status(200).json(result);
  } catch (err) {
    console.error(err.message);
  }
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
// const handleStoreCheck = async (req, res) => {
//   const { storeName } = req.body;
//   if (!storeName) {
//     return res.status(400).json({
//       message: "Store name is required",
//     });
//   }
//   //   Check for duplicate Store in the database
//   const duplicate = await StoreDB.findOne({ storeName }).exec(); //findOne method need exec() if there is no callback

//   if (duplicate) {
//     return res
//       .status(409)
//       .json({ status: false, message: "Store name already exists!" });
//   }
//   return res.status(201).json({ status: true });
// };
export { getAllStore, updateStore, deleteStore, getStore };
