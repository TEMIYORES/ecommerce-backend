const UserDB = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleUserAuth = async (req, res) => {
  const cookies = req.cookies;
  console.log("cookie available at login -", cookies?.jwt);
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password are required" });
  }
  const foundUser = await UserDB.findOne({ username }).exec();
  if (!foundUser) {
    return res
      .status(401)
      .json({ message: `Username or password does not match` });
  }
  //   evaluate Password
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) {
    return res
      .status(401)
      .json({ message: `Username or password does not match` });
  }
  const roles = Object.values(foundUser.roles).filter(Boolean);
  //   Create Jwts
  const accessToken = await jwt.sign(
    { userInfo: { username: foundUser.username, roles: roles } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const newRefreshToken = await jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const newRefreshTokenArray = !cookies?.jwt
    ? foundUser.refreshToken
    : foundUser.refreshToken.filter((token) => token !== cookies?.jwt);

  if (cookies?.jwt) {
    // Scenerio:
    // 1). user logins in but never uses the refreshToken and does not logout
    // 2). refreshToken is stolen
    // 3). If 1 & 2 reuse detection is needed to clear all Rts when user logs in
    const refreshToken = cookies.jwt;
    const foundToken = await User.findOne({ refreshToken }).exec();

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
  const result = await foundUser.save();
  res.cookie("jwt", newRefreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "None",
    secure: true,
  });
  return res.status(200).json({ accessToken });
};

module.exports = handleUserAuth;
