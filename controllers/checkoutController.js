import ProductsDB from "../model/Product.js";
import OrdersDB from "../model/Order.js";
import StoreDB from "../model/Store.js";
import https from "https";
import axios from "axios";
const checkout = async (req, res) => {
  console.log(req.body);
  const {
    storeId,
    accountId,
    origin,
    name,
    email,
    phoneNumber,
    city,
    postalCode,
    streetAddress,
    country,
    products,
  } = req.body;
  if (!storeId || !accountId || !origin) {
    return res.status(400).json({
      message: `storeId and accountId parameters are required. please reload`,
    });
  }
  const Store = await StoreDB.findOne({ _id: storeId }).exec();
  const uniqueIds = [...new Set(products)];
  console.log({ uniqueIds });
  const foundProducts = await ProductsDB.find({ _id: uniqueIds });
  let orderData = [];
  let totalOrderAmount = 0;
  for (const productId of uniqueIds) {
    const product = foundProducts.find((p) => p._id.toString() === productId);
    const productQuantity = products.filter((id) => id === productId).length;
    if (productQuantity > 0) {
      console.log({
        productData: {
          currency: "NGN",
          unitAmount: product.price,
          totalAmount: productQuantity * product.price,
          name: product.name,
        },
      });
      orderData.push({
        name: product.name,
        quantity: productQuantity,
        priceData: {
          currency: "NGN",
          unitAmount: product.price,
          totalAmount: productQuantity * product.price,
        },
      });
      totalOrderAmount += productQuantity * product.price;
    }
  }
  const customerInformation = {
    name,
    email,
    phoneNumber,
    city,
    postalCode,
    streetAddress,
    country,
  };

  const params = JSON.stringify({
    email: email,
    amount: totalOrderAmount * 100,
    currency: "NGN",
    callback_url: origin,
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };
  const paystackReq = https
    .request(options, (paystackRes) => {
      let data = "";

      paystackRes.on("data", (chunk) => {
        data += chunk;
      });

      paystackRes.on("end", async () => {
        const parsedData = JSON.parse(data);
        console.log({ parsedData });
        const paymentUrl = parsedData.data.authorization_url;
        const paymentReference = parsedData.data.reference;
        await OrdersDB.create({
          _id: paymentReference,
          storeId,
          accountId,
          orderData,
          totalAmount: totalOrderAmount,
          customerInformation,
        });
        return res.status(200).json({ paymentUrl });
      });
    })
    .on("error", (error) => {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Payment failed. Please try again later." });
    });
  paystackReq.write(params);
  paystackReq.end();
};
const verifyCheckout = async (req, res) => {
  const { storeId, accountId, id } = req.body;
  console.log(req.body);
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json", // setting Content-Type header
          },
        }
      );
      if (
        response.data.data.status === "success" &&
        response.data.data.reference
      ) {
        const fulfilledOrder = await OrdersDB.findOne({
          _id: response.data.data.reference,
        }).exec();
        if (!fulfilledOrder)
          return res
            .status(204)
            .json({ message: `No Order with OrderId ${id} Found.` });

        fulfilledOrder.paid = true;
        fulfilledOrder.save();
        return res.status(200).json({ fulfilledOrder });
      } else {
        return res.status(402).json({ message: "Payment Required." });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return res
        .status(500)
        .json({ message: "Verification failed. Please try again later." });
    }
  };
  fetchData();
};

export { checkout, verifyCheckout };
