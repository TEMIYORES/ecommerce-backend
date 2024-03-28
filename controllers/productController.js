import ProductsDB from "../model/Product.js";
import { v2 as cloudinary } from "cloudinary";
import { raw } from "express";
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
      productImages: product.productImages,
    };
  });
  res.status(200).json(result);
};
const createNewProduct = async (req, res) => {
  const { name, description, price } = req.body;
  const files = req.files;
  //   Check if Productname and password are passed in the request
  if (!name || !description || !price || !files)
    return res.status(400).json({
      message:
        "Product name, description, price and product images are required",
    });
  // Check for duplicates
  const duplicate = await ProductsDB.findOne({ name }).exec();
  if (duplicate)
    return res
      .status(409)
      .json({ message: "Product with the name already exists!" });
  try {
    let imageUrls = [];
    if (files) {
      let imageslength = Object.keys(files).length;

      if (imageslength > UPLOAD_LENGTH) {
        return res
          .status(400)
          .json({ message: "maximum of 4 files can be uploaded." });
      }
      const imageBuffers = [];
      Object.keys(files).forEach(async (key) => {
        imageBuffers.push(files[key]);
      });
      imageUrls = await Promise.all(uploadImages(imageBuffers));
      console.log({ imageUrls });
    }
    const newProduct = await ProductsDB.create({
      name,
      description,
      price,
      productImages: imageUrls,
    });
    res.status(201).json({ message: "Product created successfully!" });
  } catch (err) {
    console.error(err.message);
  }
};
const updateProduct = async (req, res) => {
  const { id, name, description, price, rawImageUrls } = req.body;
  const files = req.files;
  const splittedImages = rawImageUrls.split(",");
  //   Check if Productname and password are passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check for duplicates
  const foundProduct = await ProductsDB.findOne({ _id: id }).exec();
  if (!foundProduct)
    return res
      .status(204)
      .json({ message: `No Product with ProductId ${id} Found.` });

  if (files) {
    let imageslength;
    if (foundProduct.productImages) {
      imageslength =
        foundProduct.productImages.length + Object.keys(files).length;
    } else {
      imageslength = Object.keys(files).length;
    }
    if (imageslength > UPLOAD_LENGTH) {
      return res
        .status(400)
        .json({ message: "maximum of 4 files can be uploaded." });
    }
  }

  try {
    if (name) foundProduct.name = name;
    if (description) foundProduct.description = description;
    if (price) foundProduct.price = price;
    if (files) {
      const imageBuffers = [];
      Object.keys(files).forEach(async (key) => {
        imageBuffers.push(files[key]);
      });
      const imageUrls = await Promise.all(uploadImages(imageBuffers));
      console.log({ imageUrls });
      foundProduct.productImages.push(...imageUrls);
    } else {
      foundProduct.productImages = splittedImages;
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
    productImages: foundProduct?.productImages,
  });
};
const uploadImages = (imageBuffers) => {
  try {
    const uploadPromises = imageBuffers.map(async (imageBuffer) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) {
              console.error(error);
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          })
          .end(imageBuffer.data);
      });
    });
    return uploadPromises;
  } catch (error) {
    console.error(error);
    reject(error);
  }
};
export {
  createNewProduct,
  updateProduct,
  getAllProducts,
  deleteProduct,
  getProduct,
};
