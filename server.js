import express from "express";
import cors from "cors";
import path from "path";
import { logger } from "./middleware/LogEvent.js";
import errHandler from "./middleware/errorhandler.js";
import rootRouter from "./routes/root.js";
import subdirRouter from "./routes/subdir.js";
import employeesRouter from "./routes/api/employees.js";
import registerRoute from "./routes/api/register.js";
import authRouter from "./routes/api/auth.js";
import refreshRoute from "./routes/api/refreshToken.js";
import logoutRouter from "./routes/api/logout.js";
import userRouter from "./routes/api/users.js";
import productRouter from "./routes/api/products.js";
import categoryRouter from "./routes/api/categories.js";
import uploadRouter from "./routes/api/uploads.js";
import featuredRouter from "./routes/api/featured.js";
import cartRouter from "./routes/api/cart.js";
import checkoutRouter from "./routes/api/checkout.js";
import corsOptions from "./config/corsOptions.js";
import VerifyJWT from "./middleware/verifyJwt.js";
import cookieParser from "cookie-parser";
import credentials from "./middleware/credentials.js";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import connectDB from "./config/connectDB.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
// Get the current file's URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
import { dirname } from "path";
const __dirname = dirname(__filename);

cloudinary.config({
  cloud_name: "dlxovrmtr",
  api_key: "584384793157694",
  api_secret: "3AoswXM9NH82qR47F3iMWFqiRKc",
});

dotenv.config();

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
app.use("/.netlify/functions/", rootRouter);
app.use("/.netlify/functions/api/register", registerRoute);
app.use("/.netlify/functions/api/auth", authRouter);
app.use("/.netlify/functions/api/refresh", refreshRoute);
app.use("/.netlify/functions/api/logout", logoutRouter);
app.use("/.netlify/functions/api/featured", featuredRouter);
app.use("/.netlify/functions/api/cart", cartRouter);
app.use("/.netlify/functions/api/checkout", checkoutRouter);
app.use(VerifyJWT);
app.use("/.netlify/functions/api/employees", employeesRouter);
app.use("/.netlify/functions/api/users", userRouter);
app.use("/.netlify/functions/api/products", productRouter);
app.use("/.netlify/functions/api/categories", categoryRouter);
app.use("/.netlify/functions/api/uploads", uploadRouter);
app.use("/.netlify/functions/subdir", subdirRouter);

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
