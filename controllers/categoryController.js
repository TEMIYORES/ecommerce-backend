const CategoriesDB = require("../model/Category");

const getAllCategories = async (req, res) => {
  const allCategories = await CategoriesDB.find().populate("parentCategory");
  if (!allCategories)
    return res.status(204).json({ message: "No Categories found." });
  console.log({ allCategories });
  const result = allCategories.map((category) => {
    return {
      id: category._id,
      name: category.name,
      parentCategory: category.parentCategory,
    };
  });
  return res.status(200).json(result);
};
const createNewCategory = async (req, res) => {
  const { name, parentCategory } = req.body;
  console.log({ name, parentCategory });
  //   Check if Categoryname and password are passed in the request
  if (!name)
    return res.status(400).json({ message: "Category name is required" });
  // Check for duplicates
  const duplicate = await CategoriesDB.findOne({ name }).exec();
  if (duplicate)
    return res
      .status(409)
      .json({ message: "Category with the name already exists!" });
  try {
    const newCategory = await CategoriesDB.create({
      name,
      parentCategory: parentCategory || null,
    });
    console.log({ newCategory });
    return res.status(201).json({ message: "Category created successfully!" });
  } catch (err) {
    console.error(err.message);
  }
};
const updateCategory = async (req, res) => {
  const { id, name, parentCategory } = req.body;

  //   Check if Categoryname and password are passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check for duplicates
  const foundCategory = await CategoriesDB.findOne({ _id: id }).exec();
  if (!foundCategory)
    res
      .status(204)
      .json({ message: `No Category with CategoryId ${id} Found.` });
  try {
    if (name) foundCategory.name = name;
    foundCategory.parentCategory = parentCategory || null;

    await foundCategory.save();
    return res.status(200).json({ message: "Category updated successfully!" });
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ message: "Category failed to update" });
  }
};
const deleteCategory = async (req, res) => {
  const { id } = req.body;
  //   Check if Categoryname and password are passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check for duplicates
  const foundCategory = await CategoriesDB.findOne({ _id: id }).exec();
  if (!foundCategory)
    res
      .status(204)
      .json({ message: `No Category with CategoryId ${id} Found.` });
  await CategoriesDB.deleteOne({ _id: id });
  res
    .status(200)
    .json({ message: `Category ${foundCategory.name} deleted successfully` });
};
const getCategory = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  //   Check if id is passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check if it exists
  const foundCategory = await CategoriesDB.findOne({ _id: id }).exec();
  if (!foundCategory)
    return res.status(400).json({ message: `No Category with the CategoryId` });
  res.status(200).json({
    id: foundCategory._id,
    name: foundCategory?.name,
    description: foundCategory.description,
    price: foundCategory?.price,
  });
};

module.exports = {
  createNewCategory,
  updateCategory,
  getAllCategories,
  deleteCategory,
  getCategory,
};
