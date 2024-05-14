import AccountDB from "../model/Account.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const createAccount = async (req, res) => {
  console.log(req.body);
  const { storeId, storeName, name, email, password, phoneNumber } = req.body;

  if ((!storeId, !storeName, !email || !name || !password)) {
    return res.status(400).json({
      message:
        "store Id, store Name and all other fields are required, please reload.",
    });
  }

  //   Check for duplicate users in the database
  const firstDuplicate = await AccountDB.findOne({ storeId, email }).exec(); //findOne method need exec() if there is no callback
  const phoneQuery = {
    storeId,
    "phoneNumber.phone": phoneNumber.phone,
  };
  const secondDuplicate = await AccountDB.findOne(phoneQuery).exec();
  console.log(firstDuplicate, secondDuplicate);
  if (firstDuplicate && secondDuplicate) {
    return res
      .status(409)
      .json({ message: "Account with email and phone number already exists!" });
  }
  if (firstDuplicate && !secondDuplicate) {
    return res
      .status(409)
      .json({ message: "Account with email already exists!" });
  }
  if (!firstDuplicate && secondDuplicate) {
    return res.status(409).json({ message: "phone number already exists!" });
  }

  try {
    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = await AccountDB.create({
      storeId,
      storeName,
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    console.log({ newAccount });
    return res
      .status(201)
      .json({ message: `${name} account registered successfully!` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const loginAccount = async (req, res) => {
  const cookies = req.cookies;
  console.log("cookie available at login -", cookies?.jwt);
  const { storeId, email, phoneNumber, password } = req.body;
  console.log(req.body);
  let foundAccount = null;
  if (!storeId) {
    return res
      .status(400)
      .json({ message: "StoreId is required, please reload." });
  }
  if (email && !phoneNumber) {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }
    foundAccount = await AccountDB.findOne({
      storeId,
      email,
    }).exec();
  }
  if (phoneNumber && !email) {
    if (!phoneNumber || !password) {
      return res
        .status(400)
        .json({ message: "phone number and password are required" });
    }
    foundAccount = await AccountDB.findOne({
      storeId,
      "phoneNumber.phone": phoneNumber,
    }).exec();
  }
  console.log({ foundAccount });
  if (!foundAccount) {
    return res
      .status(401)
      .json({ message: `(email or phone number) and password does not match` });
  }
  //   evaluate Password
  const match = await bcrypt.compare(password, foundAccount.password);
  if (!match) {
    return res.status(401).json({
      message: `(email or phone number) and password does not match`,
    });
  }
  const roles = Object.values(foundAccount.roles).filter(Boolean);
  //   Create Jwts
  const accessToken = jwt.sign(
    {
      AccountInfo: {
        storeId: foundAccount.storeId,
        id: foundAccount._id,
        roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );
  const newRefreshToken = jwt.sign(
    { email: foundAccount.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  let newRefreshTokenArray = !cookies?.jwt
    ? foundAccount.refreshToken
    : foundAccount.refreshToken.filter((token) => token !== cookies?.jwt);

  if (cookies?.jwt) {
    // Scenerio:
    // 1). Account logins in but never uses the refreshToken and does not logout
    // 2). refreshToken is stolen
    // 3). If 1 & 2 reuse detection is needed to clear all Rts when Account logs in
    const refreshToken = cookies.jwt;
    const foundToken = await AccountDB.findOne({ refreshToken }).exec();

    // detected refresh token reuse!
    if (!foundToken) {
      console.log("attempted refreshToken reuse at login");
      // Clear all previous tokens
      newRefreshTokenArray = [];
    }
    res.clearCookie("account_jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
  }
  foundAccount.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  await foundAccount.save();
  res.cookie("account_jwt", newRefreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "None",
    secure: true,
  });
  return res.status(200).json({ accessToken });
};

export { createAccount, loginAccount };
