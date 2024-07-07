import CategoriesDB from "../model/Category.js";

export const getAllStoreCategories = async (req, res) => {
  const { storeId } = req.params;
  console.log({ storeId });
  if (!storeId) {
    return res.status(400).json({ message: "Store Id is required" });
  }
  const allCategories = await CategoriesDB.find({
    storeId,
  });
  console.log({ allCategories });
  if (!allCategories)
    return res.status(204).json({ message: "No Categories found." });
  const result = allCategories.map((category) => {
    return {
      id: category._id,
      name: category.name,
      parentCategory: category.parentCategory,
      properties: category.properties,
    };
  });
  return res.status(200).json(result);
};

export const getCategory = async (req, res) => {
  const { storeId, categoryName } = req.params;
  //   Check if id is passed in the request
  if (!storeId || !categoryName)
    return res
      .status(400)
      .json({ message: `Store Id and category name parameter is required!` });
  // Check if it exists
  const foundCategory = await CategoriesDB.findOne({
    storeId,
    name: categoryName,
  }).exec();
  if (!foundCategory)
    return res.status(400).json({ message: `No Category with the CategoryId` });
  res.status(200).json({
    id: foundCategory._id,
    name: foundCategory?.name,
    description: foundCategory.description,
    price: foundCategory?.price,
    properties: foundCategory.properties,
  });
};
