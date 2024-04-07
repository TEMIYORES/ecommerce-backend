im
const getAllRecentProducts = async (req, res) => {
  const allProducts = await ProductsDB.find({}, null, {
    sort: { _id: -1 },
    limit: 10,
  });
  if (!allProducts)
    return res.status(204).json({ message: "No Products found." });
  const result = allProducts.map((product) => {
    return {
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      productImages: product.productImages,
      category: product.category,
      properties: product.properties,
      time: product.updatedAt,
    };
  });
  res.status(200).json(result);
};
const getFeaturedProduct = async (req, res) => {
  const { id } = req.params;
  //   Check if id is passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check if it exists
  const foundProduct = await ProductsDB.findOne({ _id: id }).exec();
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
export { getFeaturedProduct, getAllRecentProducts };
