import OrdersDB from "../../model/Order.js";
const getAllCustomerOrders = async (req, res) => {
  const { storeId, accountId } = req.body;
  if (!storeId || !accountId) {
    return res
      .status(400)
      .json({ message: "Store Id and Account Id required." });
  }
  const allOrders = await OrdersDB.find({ storeId, accountId }, null, {
    sort: { updatedAt: -1 },
  });
  if (!allOrders) return res.status(204).json({ message: "No Orders found." });
  const result = allOrders.map((order) => {
    return {
      id: order._id,
      orderData: order.orderData,
      totalAmount: order.totalAmount,
      status: order.paid,
      date: order.updatedAt,
    };
  });
  res.status(200).json(result);
};
const getAllOrders = async (req, res) => {
  const { storeId } = req.params;
  if (!storeId) {
    return res.status(400).json({ message: "Store Id required." });
  }
  const allOrders = await OrdersDB.find({ storeId }, null, {
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
  const { storeId, id } = req.params;
  if (!storeId) {
    return res.status(400).json({ message: "Store Id required." });
  }
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
    transactionFee: foundorder.transactionFee,
    shippingFee: foundorder.shippingFee,
    status: foundorder.paid,
    date: foundorder.updatedAt,
  };
  res.status(200).json(result);
};
export { getAllOrders, getOrder, getAllCustomerOrders };
