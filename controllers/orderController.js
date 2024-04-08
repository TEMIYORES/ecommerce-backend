import OrdersDB from "../model/Order.js";
const getAllOrders = async (req, res) => {
  const allOrders = await OrdersDB.find();
  if (!allOrders) return res.status(204).json({ message: "No Orders found." });
  res.status(200).json(allOrders);
};
// const getFeaturedorder = async (req, res) => {
//   const { id } = req.params;
//   //   Check if id is passed in the request
//   if (!id)
//     return res.status(400).json({ message: `Id parameter is required!` });
//   // Check if it exists
//   const foundorder = await OrdersDB.findOne({ _id: id }).exec();
//   if (!foundorder)
//     return res.status(400).json({ message: `No order with the orderId` });
//   res.status(200).json({
//     id: foundorder._id,
//     name: foundorder?.name,
//     description: foundorder.description,
//     // price: foundorder?.price,
//     orderImage: foundorder?.orderImages[0],
//     // category: foundorder?.category,
//     // properties: foundorder?.properties,
//   });
// };
export { getAllOrders };
