import ProductsDB from "../model/Product.js";
import OrdersDB from "../model/Order.js";
import https from "https";

const checkout = async (req, res) => {
  console.log(req.body);

  const { name, email, city, postalCode, streetAddress, country, products } =
    req.body;
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
    city,
    postalCode,
    streetAddress,
    country,
  };
  OrdersDB.create({
    orderData,
    customerInformation,
  });
  console.log({ orderData });
  console.log({ totalOrderAmount });

  const params = JSON.stringify({
    email: email,
    amount: totalOrderAmount * 100,
    currency: "NGN",
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

      paystackRes.on("end", () => {
        const parsedData = JSON.parse(data);
        console.log({ parsedData });
        const paymentUrl = parsedData.data.authorization_url;
        const paymentReference = parsedData.data.reference;
        res.status(200).json({ paymentUrl, paymentReference });
      });
    })
    .on("error", (error) => {
      console.error(error);
    });
  paystackReq.write(params);
  paystackReq.end();
};

export { checkout };
