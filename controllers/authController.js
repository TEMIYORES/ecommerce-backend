const UserDB = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleUserAuth = async (req, res) => {
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
  const roles = Object.values(foundUser.roles);
  //   Create Jwts
  const accessToken = await jwt.sign(
    { userInfo: { username: foundUser.username, roles: roles } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "2m" }
  );
  const refreshToken = await jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  //   Storing refreshToken with user in Database
  //   const result = await UserDB.findOneAndUpdate(
  //     { username },
  //     { refreshToken },
  //     {
  //       new: true,
  //       upsert: true, // Make this update into an upsert
  //     }
  //   );
  foundUser.refreshToken = refreshToken;
  const result = await foundUser.save();
  console.log(result);
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "None",
    // secure: true,
  });
  return res.status(200).json({ accessToken });
};

module.exports = handleUserAuth;
