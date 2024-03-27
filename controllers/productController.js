import ProductsDB from "../model/Product.js";
import { v2 as cloudinary } from "cloudinary";
import fetch from "node-fetch";
const UPLOAD_LENGTH = 4;

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
  const { id, name, description, price, rawImageUrls } = req.body;
  console.log({ rawImageUrls });
  //   Check if Productname and password are passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check for duplicates
  const foundProduct = await ProductsDB.findOne({ _id: id }).exec();
  if (!foundProduct)
    return res
      .status(204)
      .json({ message: `No Product with ProductId ${id} Found.` });

  let imageslength;
  if (foundProduct.productImages) {
    imageslength = foundProduct.productImages.length + rawImageUrls.length;
  } else {
    imageslength = rawImageUrls.length;
  }
  if (imageslength > UPLOAD_LENGTH) {
    return res
      .status(400)
      .json({ message: "maximum of 4 files can be uploaded." });
  }
  try {
    if (name) foundProduct.name = name;
    if (description) foundProduct.description = description;
    if (price) foundProduct.price = price;
    if (rawImageUrls) {
      const imageUrls = await Promise.all(uploadImages(rawImageUrls));
      console.log({ imageUrls });
      foundProduct.productImages = [...imageUrls];
    }
    // await foundProduct.save();
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
const uploadImages = (rawImageUrls) => {
  const uploadPromises = rawImageUrls.map(async (imageUrl) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Download the image  from  the Object URL
        const response = await fetch(objectUrl);
        const imageBuffer = await response.buffer(); // Convert the response to a buffer

        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) {
              console.error(error);
              reject(error);
            } else {
              console.log(result);
              resolve(result.secure_url);
            }
          })
          .end(imageBuffer);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  });
  return uploadPromises;
};
export {
  createNewProduct,
  updateProduct,
  getAllProducts,
  deleteProduct,
  getProduct,
};
