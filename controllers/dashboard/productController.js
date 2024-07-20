import ProductsDB from "../../model/Product.js";
import { v2 as cloudinary } from "cloudinary";
const UPLOAD_LENGTH = 4;

const getAllProducts = async (req, res) => {
  const { storeId } = req.params;
  if (!storeId) {
    return res.status(400).json({ message: "Store Id required." });
  }
  const allProducts = await ProductsDB.find({ storeId });
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
    };
  });
  res.status(200).json(result);
};
const createNewProduct = async (req, res) => {
  const { storeId, name, description, price, category, properties } = req.body;
  if (!storeId) {
    return res.status(400).json({ message: "Store Id required." });
  }
  const files = req.files;
  //   Check if Productname and password are passed in the request
  if (!name || !description || !price || !files)
    return res.status(400).json({
      message:
        "product name, description, price and product images are required",
    });
  if (!storeId)
    return res.status(400).json({
      message: "Store Id is required",
    });
  // Check for duplicates
  const duplicate = await ProductsDB.findOne({ storeId, name }).exec();
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
      imageUrls = await Promise.all(uploadImages(imageBuffers, storeId));
      console.log({ imageUrls });
    }
    await ProductsDB.create({
      storeId,
      name,
      description,
      price,
      productImages: imageUrls,
      category,
      properties: JSON.parse(properties),
    });
    res.status(201).json({ message: "Product created successfully!" });
  } catch (err) {
    console.error(err.message);
  }
};
const updateProduct = async (req, res) => {
  const {
    storeId,
    id,
    name,
    description,
    price,
    category,
    properties,
    rawImageUrls,
    deletedImageUrls,
  } = req.body;
  if (!storeId) {
    return res.status(400).json({ message: "Store Id required." });
  }
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  const files = req.files;
  const splittedImages = rawImageUrls
    .split(",")
    .filter((url) => url.includes("https://res.cloudinary.com"));

  // Check for duplicates
  const foundProduct = await ProductsDB.findOne({ storeId, _id: id }).exec();
  console.log({ foundProduct });
  if (!foundProduct)
    return res
      .status(204)
      .json({ message: `No Product with ProductId ${id} Found.` });

  if (files) {
    let imageslength;
    if (foundProduct.productImages) {
      imageslength = splittedImages.length + Object.keys(files).length;
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
    if (category) foundProduct.category = category;
    if (properties) foundProduct.properties = { ...JSON.parse(properties) };

    const parsedDeletedImageUrls = JSON.parse(deletedImageUrls);
    if (parsedDeletedImageUrls.length) {
      parsedDeletedImageUrls.forEach(async (url) => {
        const splitUrl = url.split("/");
        const imageToDeleteId = splitUrl[splitUrl.length - 1].split(".")[0];
        console.log({ imageToDeleteId });
        await deleteImage(imageToDeleteId, storeId);
      });
    }
    if (files) {
      const imageBuffers = [];
      Object.keys(files).forEach(async (key) => {
        imageBuffers.push(files[key]);
      });
      const imageUrls = await Promise.all(uploadImages(imageBuffers, storeId));
      console.log({ imageUrls });
      foundProduct.productImages = [...splittedImages, ...imageUrls];
    } else {
      console.log({ splittedImages });
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
  const { storeId } = req.params;
  if (!storeId) {
    return res.status(400).json({ message: "Store Id required." });
  }
  const { id } = req.body;
  //   Check if Productname and password are passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check for duplicates
  const foundProduct = await ProductsDB.findOne({ storeId, _id: id }).exec();
  if (!foundProduct)
    return res
      .status(204)
      .json({ message: `No Product with ProductId ${id} Found.` });

  foundProduct.productImages.forEach(async (url) => {
    const splitUrl = url.split("/");
    const imageToDeleteId = splitUrl[splitUrl.length - 1].split(".")[0];
    console.log({ imageToDeleteId });
    await deleteImage(imageToDeleteId, storeId);
  });
  await ProductsDB.deleteOne({ _id: id });
  res
    .status(200)
    .json({ message: `product ${foundProduct.name} deleted successfully` });
};
const getProduct = async (req, res) => {
  const { storeId } = req.params;
  if (!storeId) {
    return res.status(400).json({ message: "Store Id required." });
  }
  const { id } = req.params;
  console.log("id", id);
  //   Check if id is passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check if it exists
  const foundProduct = await ProductsDB.findOne({ storeId, _id: id }).exec();
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
const uploadImages = (imageBuffers, folderName) => {
  try {
    const uploadPromises = imageBuffers.map(async (imageBuffer) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: `EcommartNg/${folderName}`, resource_type: "image" },
            (error, result) => {
              if (error) {
                console.error("error", error);
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          )
          .end(imageBuffer.data);
      });
    });
    return uploadPromises;
  } catch (error) {
    console.error("error", error);
    reject(error);
  }
};

// Function to delete an image from Cloudinary
const deleteImage = async (imageToDeleteId, folderName) => {
  try {
    const result = await cloudinary.uploader.destroy(
      `EcommartNg/${folderName}/` + imageToDeleteId,
      {
        resource_type: "image",
      }
    );
    console.log("Image deletion result:", result);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
export {
  createNewProduct,
  updateProduct,
  getAllProducts,
  deleteProduct,
  getProduct,
};
