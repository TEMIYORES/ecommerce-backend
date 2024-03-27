import UserDB from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const handleUserAuth = async (req, res) => {
  const cookies = req.cookies;
  console.log("cookie available at login -", cookies?.jwt);
  const { email, password, isAuthenticated, picture } = req.body;
  if (!email || (!isAuthenticated && !password)) {
    return res.status(400).json({ message: "email and password are required" });
  }
  console.log({ email });
  const foundUser = await UserDB.findOne({ email }).exec();
  if (!foundUser) {
    return res
      .status(401)
      .json({ message: `email or password does not match` });
  }
  if (!isAuthenticated) {
    //   evaluate Password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res
        .status(401)
        .json({ message: `email or password does not match` });
    }
  }

  const roles = Object.values(foundUser.roles).filter(Boolean);
  //   Create Jwts
  const accessToken = await jwt.sign(
    {
      userInfo: {
        id: foundUser.id,
        email: foundUser.email,
        roles: roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );
  const newRefreshToken = await jwt.sign(
    { email: foundUser.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  let newRefreshTokenArray = !cookies?.jwt
    ? foundUser.refreshToken
    : foundUser.refreshToken.filter((token) => token !== cookies?.jwt);

  if (cookies?.jwt) {
    // Scenerio:
    // 1). user logins in but never uses the refreshToken and does not logout
    // 2). refreshToken is stolen
    // 3). If 1 & 2 reuse detection is needed to clear all Rts when user logs in
    const refreshToken = cookies.jwt;
    const foundToken = await UserDB.findOne({ refreshToken }).exec();

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
  foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  if (foundUser.picture === undefined) foundUser.picture = picture || ".js";
  const result = await foundUser.save();
  console.log(result);
  res.cookie("jwt", newRefreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "None",
    secure: true,
  });
  return res.status(200).json({ accessToken });
};

export default handleUserAuth;
