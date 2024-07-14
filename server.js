import express from "express";
import cors from "cors";
import path from "path";
import { logger } from "./middleware/LogEvent.js";
import errHandler from "./middleware/errorhandler.js";
import rootRouter from "./routes/root.js";
import subdirRouter from "./routes/subdir.js";
import dashboardAuthRoute from "./routes/api/dashboard/auth.js";
import storeAccountRoute from "./routes/api/dashboard/store.js";
import waitListRoute from "./routes/api/waitlist.js";
import storesRouter from "./routes/api/dashboard/store.js";
import productRouter from "./routes/api/dashboard/products.js";
import settingsRouter from "./routes/api/dashboard/settings.js";
import categoryRouter from "./routes/api/dashboard/categories.js";
import storeProductsRouter from "./routes/api/store/storeProducts.js";
import cartRouter from "./routes/api/store/cart.js";
import wishListRouter from "./routes/api/store/wishList.js";
import storeCategoriesRouter from "./routes/api/store/storeCategories.js";
import checkoutRouter from "./routes/api/store/checkout.js";
import storeOrderRouter from "./routes/api/store/order.js";
import dashboardOrderRouter from "./routes/api/dashboard/order.js";
import storeAuthRoute from "./routes/api/store/auth.js";
import addressRouter from "./routes/api/store/address.js";
import shippingFeeRouter from "./routes/api/store/shippingFee.js";
import checkStoreRouter from "./routes/api/store/checkStore.js";
import corsOptions from "./config/corsOptions.js";
import cookieParser from "cookie-parser";
import credentials from "./middleware/credentials.js";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import connectDB from "./config/connectDB.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
// Get the current file's URL
const __filename = fileURLToPath(import.meta.url);
dotenv.config();

// Get the directory name
import { dirname } from "path";
const __dirname = dirname(__filename);

cloudinary.config({
  cloud_name: "dlxovrmtr",
  api_key: process.env.CLOUDINARY_SECRET_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const app = express();
const PORT = process.env.PORT || 3500;

connectDB();
// custom middleware logger
app.use(logger);

// Handle Options credentials check - use before CORS!
// and fetch cookies credentials requirement'
app.use(credentials);
// Cors
app.use(cors(corsOptions));

// Built in middleware to handle urlencoded data
// in other words form-data;
// 'Content-Type': 'application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// built-in middleware for static files
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/subdir", express.static(path.join(__dirname, "public")));

// Routes
app.use("/api", rootRouter);

// Store Apis
app.use("/api/store/auth", storeAuthRoute);
app.use("/api/store/orders", storeOrderRouter);

app.use("/api/store/waitlist", waitListRoute);
app.use("/api/store/products", storeProductsRouter);
app.use("/api/store/cart", cartRouter);
app.use("/api/store/wishlist", wishListRouter);
app.use("/api/store/categories", storeCategoriesRouter);
app.use("/api/store/address", addressRouter);
app.use("/api/store/checkout", checkoutRouter);
app.use("/api/store/checkstore", checkStoreRouter);
app.use("/api/store/shippingFee", shippingFeeRouter);

// Dashboard Apis
app.use("/api/dashboard/auth", dashboardAuthRoute);
app.use("/api/dashboard/store", storeAccountRoute);
app.use("/api/dashboard/orders", dashboardOrderRouter);
app.use("/api/dashboard/products", productRouter);
app.use("/api/dashboard/categories", categoryRouter);
app.use("/api/dashboard/settings", settingsRouter);

app.use("/api/stores", storesRouter);
app.use("/subdir", subdirRouter);

app.all("*", (req, res) => {
  if (req.accepts("html")) {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.status(404).json({ error: "404 Not Found" });
  } else {
    res.status(404).type("txt").send("404 Not Found");
  }
});

app.use(errHandler);
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on PORT`, PORT);
  });
});
