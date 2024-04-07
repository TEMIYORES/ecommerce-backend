import ProductsDB from "../model/Product.js";
const getAllCartProducts = async (req, res) => {
  const { ids } = req.body;
  const allProducts = await ProductsDB.find({ _id: ids });
  if (!allProducts)
    return res.status(204).json({ message: "No Products found." });
  const result = allProducts.map((product) => {
    return {
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      productImage: product.productImages[0],
      category: product.category,
      properties: product.properties,
      time: product.updatedAt,
    };
  });
  res.status(200).json(result);
};

export { getAllCartProducts };
