import ProductsDB from "../model/Product.js";
const getRecentProducts = async (req, res) => {
  const { storeId } = req.body;
  const allProducts = await ProductsDB.find({ storeId }, null, {
    sort: { _id: -1 },
    limit: 10,
  });
  if (!allProducts)
    return res.status(204).json({ message: "No Products found." });
  const result = allProducts.map((product) => {
    return {
      id: product._id,
      name: product.name,
      price: product.price,
      productImage: product.productImages[0],
    };
  });
  res.status(200).json(result);
};
const getAllProducts = async (req, res) => {
  const { storeId } = req.body;
  const allProducts = await ProductsDB.find({ storeId }, null, {
    sort: { _id: -1 },
  });
  if (!allProducts)
    return res.status(204).json({ message: "No Products found." });
  const result = allProducts.map((product) => {
    return {
      id: product._id,
      name: product.name,
      price: product.price,
      productImage: product.productImages[0],
    };
  });
  res.status(200).json(result);
};
const getFeaturedProduct = async (req, res) => {
  const { id } = req.params;
  const { storeId } = req.body;
  //   Check if id is passed in the request
  if (!storeId)
    return res.status(400).json({ message: `store Id parameter is required!` });
  // Check if it exists
  const foundProduct = await ProductsDB.findOne({ _id: id, storeId }).exec();
  if (!foundProduct)
    return res.status(400).json({ message: `No Product with the ProductId` });
  res.status(200).json({
    id: foundProduct._id,
    name: foundProduct?.name,
    description: foundProduct.description,
    // price: foundProduct?.price,
    productImage: foundProduct?.productImages[0],
    // category: foundProduct?.category,
    // properties: foundProduct?.properties,
  });
};
const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  const { storeId } = req.body;
  //   Check if id is passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check if it exists
  const foundProduct = await ProductsDB.findOne({ _id: id, storeId }).exec();
  if (!foundProduct)
    return res.status(400).json({ message: `No Product with the ProductId` });
  res.status(200).json({
    id: foundProduct._id,
    name: foundProduct?.name,
    description: foundProduct.description,
    price: foundProduct?.price,
    productImages: foundProduct?.productImages,
    category: foundProduct?.category,
    properties: foundProduct?.properties,
  });
};
export {
  getFeaturedProduct,
  getAllProducts,
  getRecentProducts,
  getSingleProduct,
};
