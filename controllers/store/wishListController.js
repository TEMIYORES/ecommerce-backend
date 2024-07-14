import WishListDB from "../../model/WishList.js";
const saveWishProduct = async (req, res) => {
  const { storeId, accountId, productId } = req.body;
  if (!storeId || !accountId || !productId)
    return res
      .status(400)
      .json({ message: `Store Id and other parameters are required!` });

  const foundWishListAccount = await WishListDB.findOne({
    storeId,
    accountId,
  }).exec();
  // If product is found in wishlist then we should delete it, if not create it.
  if (foundWishListAccount) {
    const duplicate = foundWishListAccount.productIds.filter(
      (id) => id == productId
    );
    console.log({ ids: foundWishListAccount.productIds });
    console.log({ duplicate });
    if (duplicate.length) {
      const newIds = foundWishListAccount.productIds.filter(
        (id) => id != productId
      );
      foundWishListAccount.productIds = newIds;
      foundWishListAccount.save();
      return res
        .status(200)
        .json({ saved: false, message: `product removed from wishlist` });
    } else {
      foundWishListAccount.productIds.push(productId);
      foundWishListAccount.save();
      return res
        .status(201)
        .json({ saved: true, message: "Product saved to wishlist!" });
    }
  } else {
    const wishlistAccount = await WishListDB.create({
      storeId,
      accountId,
    });
    wishlistAccount.productIds.push(productId);
    await wishlistAccount.save();
    console.log({ this: wishlistAccount });
    return res
      .status(201)
      .json({ saved: true, message: "Product saved to wishlist!" });
  }
};
const getWishListIds = async (req, res) => {
  const { storeId, accountId } = req.body;
  if (!storeId || !accountId)
    return res
      .status(400)
      .json({ message: `Store Id and account Id parameters are required!` });

  const wishListAccount = await WishListDB.findOne({
    storeId,
    accountId,
  });
  console.log({ wishListAccount });
  let result = [];
  if (wishListAccount) {
    result = [...wishListAccount.productIds];
  }
  res.status(200).json(result);
};

const getWishListProducts = async (req, res) => {
  const { storeId, accountId } = req.body;
  if (!storeId || !accountId)
    return res
      .status(400)
      .json({ message: `Store Id and account Id parameter is required!` });

  const wishListAccount = await WishListDB.findOne({
    storeId,
    accountId,
  }).populate("productIds");

  let result = [];
  if (wishListAccount) {
    console.log({ ids: wishListAccount.productIds });
    result = wishListAccount.productIds.map((product) => {
      return {
        id: product._id,
        name: product.name,
        price: product.price,
        productImage: product.productImages[0],
      };
    });
  }

  res.status(200).json(result);
};
export { saveWishProduct, getWishListProducts, getWishListIds };
