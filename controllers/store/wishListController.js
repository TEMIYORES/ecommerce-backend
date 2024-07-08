import WishListDB from "../../model/WishList.js";
import ProductsDB from "../../model/Product.js";
const saveWishProduct = async (req, res) => {
  const { wished, storeId, accountId, productId } = req.body;
  if (!storeId || !accountId || !productId)
    return res
      .status(400)
      .json({ message: `Store Id and other parameters are required!` });

  const foundProduct = await WishListDB.findOne({
    storeId,
    accountId,
    productId,
  }).exec();
  // If product is found in wishlist then we should delete it, if not create it.
  if (foundProduct) {
    await WishListDB.deleteOne({ storeId, accountId, productId });
    return res
      .status(200)
      .json({ saved: false, message: `product removed from wishlist` });
  } else {
    await WishListDB.create({
      storeId,
      accountId,
      productId,
    });
    return res
      .status(201)
      .json({ saved: true, message: "Product saved to wishlist!" });
  }
};
const getWishListIds = async (req, res) => {
  const { storeId, accountId } = req.body;
  if (!storeId)
    return res.status(400).json({ message: `Store Id parameter is required!` });
  const allProducts = await ProductsDB.find({ storeId }, null, {
    sort: { _id: -1 },
    limit: 10,
  });
  if (!allProducts)
    return res.status(204).json({ message: "No Products found." });
  let result = [];
  if (accountId) {
    const wishedProducts = await WishListDB.find({
      storeId,
      accountId,
      productId: allProducts.map((product) => product.id.toString()),
    });
    result = wishedProducts.map((product) => {
      return product.productId;
    });
  }
  res.status(200).json(result);
};
const getWishListProducts = async (req, res) => {
  const { storeId, accountId } = req.body;
  if (!storeId)
    return res.status(400).json({ message: `Store Id parameter is required!` });
  const allProducts = await ProductsDB.find({ storeId }, null, {
    sort: { _id: -1 },
    limit: 10,
  });
  if (!allProducts)
    return res.status(204).json({ message: "No Products found." });
  let result = [];
  if (accountId) {
    const wishedProducts = await WishListDB.find({
      storeId,
      accountId,
      productId: allProducts.map((product) => product.id.toString()),
    }).populate("productId");
    result = wishedProducts.map((product) => {
      return {
        id: product.productId._id,
        name: product.productId.name,
        price: product.productId.price,
        productImage: product.productId.productImages[0],
      };
    });
  }

  res.status(200).json(result);
};
export { saveWishProduct, getWishListProducts, getWishListIds };
