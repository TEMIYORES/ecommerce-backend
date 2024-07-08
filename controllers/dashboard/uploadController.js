import UploadsDB from "../../model/Upload.js";
import { v2 as cloudinary } from "cloudinary";
const UPLOAD_LENGTH = 4;
const getUpload = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  //   Check if id is passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check if it exists
  const foundUpload = await UploadsDB.findOne({ productId: id }).exec();
  if (!foundUpload)
    return res
      .status(204)
      .json({ message: `No Upload with the Product Id Found.` });
  return res.status(200).json({
    images: foundUpload.productImages,
  });
};
const createNewUpload = async (req, res) => {
  const { id } = req.params;
  const files = req.files;
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check for duplicates
  const foundProductImages = await UploadsDB.findOne({ productId: id }).exec();
  console.log({ foundProductImages });
  let imageslength;
  if (foundProductImages) {
    imageslength =
      foundProductImages.productImages.length + Object.keys(files).length;
  } else {
    imageslength = Object.keys(files).length;
  }
  if (imageslength > UPLOAD_LENGTH) {
    return res
      .status(400)
      .json({ message: "maximum of 4 files can be uploaded." });
  }
  const imageBuffers = [];
  Object.keys(files).forEach(async (key) => {
    imageBuffers.push(files[key]);
  });
  try {
    const uploadPromises = imageBuffers.map(async (imageBuffer) => {
      return new Promise((resolve, reject) => {
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
          .end(imageBuffer.data);
      });
    });
    const imageUrls = await Promise.all(uploadPromises);
    if (foundProductImages) {
      foundProductImages.productImages.push(...imageUrls);
      await foundProductImages.save();
      return res.json({ message: "file uploaded successfully" });
    } else {
      await UploadsDB.create({
        productId: id,
        productImages: [...imageUrls],
      });
      return res.json({ message: "file uploaded successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
};

// Convert Buffer to Readable stream
// function bufferToStream(buffer) {
//   const stream = new Readable();
//   stream.push(buffer);
//   stream.push(null); // Indicates the end of the stream
//   return stream;
// }
export { createNewUpload, getUpload };
