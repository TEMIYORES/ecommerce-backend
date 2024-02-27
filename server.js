const express = require("express");
const cors = require("cors");
const path = require("path");
const { logger } = require("./middleware/LogEvent");
const errHandler = require("./middleware/errorhandler");
const rootRouter = require("./routes/root");
const subdirRouter = require("./routes/subdir");
const employeesRouter = require("./routes/api/employees");
const registerRoute = require("./routes/api/register");
const authRouter = require("./routes/api/auth");
const refreshRoute = require("./routes/api/refreshToken");
const logoutRouter = require("./routes/api/logout");
const userRouter = require("./routes/api/users");
const corsOptions = require("./config/corsOptions");
const VerifyJWT = require("./middleware/verifyJwt");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/connectDB");
require("dotenv").config();

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
app.use("/", rootRouter);
app.use("/api/register", registerRoute);
app.use("/api/auth", authRouter);
app.use("/api/refresh", refreshRoute);
app.use("/api/logout", logoutRouter);
app.use(VerifyJWT);
app.use("/api/employees", employeesRouter);
app.use("/api/users", userRouter);
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
