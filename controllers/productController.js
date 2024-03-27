const ProductsDB = require("../model/Product");
const UploadsDB = require("../model/Upload");

const getAllProducts = async (req, res) => {
  const allProducts = await ProductsDB.find();
  if (!allProducts)
    return res.status(204).json({ message: "No Products found." });
  const result = allProducts.map((product) => {
    return {
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
    };
  });
  res.status(200).json(result);
};
const createNewProduct = async (req, res) => {
  const { name, description, price } = req.body;
  //   Check if Productname and password are passed in the request
  if (!name || !description || !price)
    return res
      .status(400)
      .json({ message: "Product name, description and price are required" });
  // Check for duplicates
  const duplicate = await ProductsDB.findOne({ name }).exec();
  if (duplicate)
    return res
      .status(409)
      .json({ message: "Product with the name already exists!" });
  try {
    const newProduct = await ProductsDB.create({
      name,
      description,
      price,
    });
    res.status(201).json({ message: "Product created successfully!" });
  } catch (err) {
    console.error(err.message);
  }
};
const updateProduct = async (req, res) => {
  const { id, name, description, price, imageUrls } = req.body;
  console.log({ imageUrls });
  //   Check if Productname and password are passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check for duplicates
  const foundProduct = await ProductsDB.findOne({ _id: id }).exec();
  if (!foundProduct)
    return res
      .status(204)
      .json({ message: `No Product with ProductId ${id} Found.` });
  try {
    if (name) foundProduct.name = name;
    if (description) foundProduct.description = description;
    if (price) foundProduct.price = price;
    if (imageUrls) {
      foundProduct.productImages = [...imageUrls];
      const foundProductImages = await UploadsDB.findOne({
        productId: id,
      }).exec();
      foundProductImages.productImages = [...imageUrls];
      await foundProductImages.save();
    }
    await foundProduct.save();
    return res.status(200).json({ message: "Product updated successfully!" });
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ message: "Product failed to update" });
  }
};
const deleteProduct = async (req, res) => {
  const { id } = req.body;
  //   Check if Productname and password are passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check for duplicates
  const foundProduct = await ProductsDB.findOne({ _id: id }).exec();
  if (!foundProduct)
    res.status(204).json({ message: `No Product with ProductId ${id} Found.` });
  await ProductsDB.deleteOne({ _id: id });
  res
    .status(200)
    .json({ message: `product ${foundProduct.name} deleted successfully` });
};
const getProduct = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
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
    price: foundProduct?.price,
  });
};

module.exports = {
  createNewProduct,
  updateProduct,
  getAllProducts,
  deleteProduct,
  getProduct,
};
