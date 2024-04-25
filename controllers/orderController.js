import OrdersDB from "../model/Order.js";
const getAllOrders = async (req, res) => {
  const allOrders = await OrdersDB.find({}, null, {
    sort: { updatedAt: -1 },
  });
  if (!allOrders) return res.status(204).json({ message: "No Orders found." });
  const result = allOrders.map((order) => {
    return {
      id: order._id,
      orderData: order.orderData.map((product) => product.name),
      totalAmount: order.totalAmount,
      status: order.paid,
      date: order.updatedAt,
    };
  });
  res.status(200).json(result);
};
const getOrder = async (req, res) => {
  const { id } = req.params;
  //   Check if id is passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check if it exists
  const foundorder = await OrdersDB.findOne({ _id: id }).exec();
  if (!foundorder)
    return res.status(400).json({ message: `No order with the orderId` });
  const result = {
    id: foundorder._id,
    customerInformation: foundorder.customerInformation,
    orderData: foundorder.orderData,
    totalAmount: foundorder.totalAmount,
    status: foundorder.paid,
    date: foundorder.updatedAt,
  };
  res.status(200).json(result);
};
export { getAllOrders, getOrder };
