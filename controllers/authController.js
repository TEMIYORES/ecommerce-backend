import StoreDB from "../model/Store.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const handleStoreAuth = async (req, res) => {
  const cookies = req.cookies;
  console.log("cookie available at login -", cookies?.jwt);
  const { email, password, isAuthenticated, picture } = req.body;
  if (!email || (!isAuthenticated && !password)) {
    return res.status(400).json({ message: "email and password are required" });
  }
  const foundStore = await StoreDB.findOne({ email }).exec();
  if (!foundStore) {
    return res
      .status(401)
      .json({ message: `email or password does not match` });
  }
  if (!isAuthenticated) {
    //   evaluate Password
    const match = await bcrypt.compare(password, foundStore.password);
    if (!match) {
      return res
        .status(401)
        .json({ message: `email or password does not match` });
    }
  }

  const roles = Object.values(foundStore.roles).filter(Boolean);
  //   Create Jwts
  const accessToken = jwt.sign(
    {
      StoreInfo: {
        id: foundStore.id,
        email: foundStore.email,
        roles: roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );
  const newRefreshToken = jwt.sign(
    { email: foundStore.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  let newRefreshTokenArray = !cookies?.jwt
    ? foundStore.refreshToken
    : foundStore.refreshToken.filter((token) => token !== cookies?.jwt);

  if (cookies?.jwt) {
    // Scenerio:
    // 1). Store logins in but never uses the refreshToken and does not logout
    // 2). refreshToken is stolen
    // 3). If 1 & 2 reuse detection is needed to clear all Rts when Store logs in
    const refreshToken = cookies.jwt;
    const foundToken = await StoreDB.findOne({ refreshToken }).exec();

    // detected refresh token reuse!
    if (!foundToken) {
      console.log("attempted refreshToken reuse at login");
      // Clear all previous tokens
      newRefreshTokenArray = [];
    }
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
  }
  foundStore.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  if (foundStore.picture === undefined) foundStore.picture = picture || ".js";
  const result = await foundStore.save();
  console.log(result);
  res.cookie("jwt", newRefreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "None",
    secure: true,
  });
  return res.status(200).json({ accessToken });
};

export default handleStoreAuth;
