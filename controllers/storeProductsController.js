import ProductsDB from "../model/Product.js";
import CategoriesDB from "../model/Category.js";
import SettingDB from "../model/Setting.js";
const getRecentProducts = async (req, res) => {
  const { storeId } = req.params;
  if (!storeId)
    return res.status(400).json({ message: `Store Id parameter is required!` });
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
  const { storeId } = req.params;
  if (!storeId)
    return res.status(400).json({ message: `Store Id parameter is required!` });
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
const getAllCategoryProducts = async (req, res) => {
  const { storeId } = req.params;
  const { mainCategoriesName } = req.body;
  console.log({ mainCategoriesName });
  if (!storeId || !mainCategoriesName?.length)
    return res
      .status(400)
      .json({ message: `Store Id and category Id parameter is required!` });
  let categoriesProducts = {};
  const categories = await CategoriesDB.find({ storeId }).populate(
    "parentCategory"
  );

  for (const categoryName of mainCategoriesName) {
    console.log({ categories });
    const childCategories = categories
      .filter((category) => category.parentCategory?.name === categoryName)
      .map((category) => category.name);
    console.log({ childCategories });
    const mainAndChildCategories = [categoryName, ...childCategories];
    console.log({ mainAndChildCategories });
    const allProducts = await ProductsDB.find(
      { storeId, category: mainAndChildCategories },
      null,
      {
        limit: 4,
        sort: { _id: -1 },
      }
    );
    console.log({ allProducts });
    categoriesProducts[categoryName] = allProducts.map((product) => {
      return {
        id: product._id,
        name: product.name,
        price: product.price,
        productImage: product.productImages[0],
      };
    });
  }

  if (!Object.keys(categoriesProducts).length)
    return res.status(204).json({ message: "No Products found." });
  const result = categoriesProducts;
  res.status(200).json(result);
};
const getSingleCategoryProducts = async (req, res) => {
  const { storeId, categoryName } = req.params;
  const { filter, sort } = req.body;
  console.log({ storeId });
  console.log({ filter });
  console.log({ sort });

  if (!storeId || !categoryName?.length)
    return res
      .status(400)
      .json({ message: `Store Id and category name parameter is required!` });

  const productQuery = { storeId };
  if (filter) {
    const newFilter = {};
    filter?.forEach((prop) => {
      if (prop.value !== "") {
        newFilter[prop.name] = prop.value;
      }
    });

    if (Object.values(newFilter)?.find((prop) => prop !== "")) {
      Object.keys(newFilter).forEach((filterName) => {
        productQuery["properties." + filterName] = newFilter[filterName];
      });
    }
  }

  const categories = await CategoriesDB.find({ storeId }).populate(
    "parentCategory"
  );
  const childCategories = categories
    .filter((category) => category.parentCategory?.name === categoryName)
    .map((category) => category.name);
  console.log({ childCategories });

  const mainAndChildCategories = [categoryName, ...childCategories];
  productQuery.category = [...mainAndChildCategories];
  console.log({ mainAndChildCategories });
  console.log({ productQuery });
  const [sortField, sortOrder] = sort.split("-");
  const allProducts = await ProductsDB.find(productQuery, null, {
    sort: { [sortField]: sortOrder === "asc" ? 1 : -1 },
  });
  console.log({ allProducts });
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
  const { storeId } = req.params;
  console.log({ storeId });
  //   Check if id is passed in the request
  if (!storeId)
    return res.status(400).json({
      message: `Store Id parameter is required. Please reload the page`,
    });
  // Check if it exists
  const settingDoc = await SettingDB.findOne({ storeId }).exec();
  let id = "";
  if (settingDoc) {
    id = settingDoc.settings.featuredProductId;
  } else {
    const firstProduct = ProductsDB.findOne({ storeId });
    if (firstProduct) {
      id = firstProduct._id;
    }
  }
  console.log({ id });
  const foundProduct = await ProductsDB.findOne({ _id: id, storeId }).exec();
  console.log({ foundProduct });
  if (!foundProduct)
    return res.status(400).json({ message: `No Product with the ProductId` });
  res.status(200).json({
    id: foundProduct?._id,
    name: foundProduct?.name,
    description: foundProduct.description,
    // price: foundProduct?.price,
    productImage: foundProduct?.productImages[0],
    // category: foundProduct?.category,
    // properties: foundProduct?.properties,
  });
};
const getSingleProduct = async (req, res) => {
  const { storeId, id } = req.params;
  //   Check if id is passed in the request
  if (!storeId || !id)
    return res
      .status(400)
      .json({ message: `Store Id and Product Id parameter is required!` });
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
const getSearchProducts = async (req, res) => {
  const { storeId, searchValue, categoryName } = req.params;
  const { filter, sort } = req.body;
  console.log({ storeId });
  console.log({ filter });
  console.log({ sort });

  if (!storeId)
    return res.status(400).json({ message: `Store Id parameter is required!` });

  const productQuery = { storeId };
  if (Object.prototype.toString.call(filter) === "[object Object]") {
    const newFilter = {};
    filter?.forEach((prop) => {
      if (prop.value !== "") {
        newFilter[prop.name] = prop.value;
      }
    });

    if (Object.values(newFilter)?.find((prop) => prop !== "")) {
      Object.keys(newFilter).forEach((filterName) => {
        productQuery["properties." + filterName] = newFilter[filterName];
      });
    }
  }
  if (categoryName) {
    const categories = await CategoriesDB.find({ storeId }).populate(
      "parentCategory"
    );
    const childCategories = categories
      .filter((category) => category.parentCategory?.name === categoryName)
      .map((category) => category.name);
    console.log({ childCategories });

    const mainAndChildCategories = [categoryName, ...childCategories];
    productQuery.category = [...mainAndChildCategories];
    console.log({ mainAndChildCategories });
    console.log({ productQuery });
  }
  if (searchValue !== "all") {
    productQuery["$or"] = [
      { name: { $regex: searchValue, $options: "i" } },
      { description: { $regex: searchValue, $options: "i" } },
    ];
  }
  const [sortField, sortOrder] = (sort || "_id-desc").split("-");
  const allProducts = await ProductsDB.find(productQuery, null, {
    sort: { [sortField]: sortOrder === "asc" ? 1 : -1 },
  });
  console.log({ allProducts });
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
export {
  getFeaturedProduct,
  getAllProducts,
  getAllCategoryProducts,
  getSingleCategoryProducts,
  getSearchProducts,
  getRecentProducts,
  getSingleProduct,
};
