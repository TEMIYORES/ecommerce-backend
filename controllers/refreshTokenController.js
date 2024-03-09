const jwt = require("jsonwebtoken");
const UsersDB = require("../model/User");

const handleRefreshToken = async (req, res) => {
  const cookies = await req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = await cookies.jwt.trim();
  // Clear the refreshToken here
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  console.log("refreshToken", refreshToken);
  //   Check for user with the refreshToken
  // foundUser = await UsersDB.findOne({
  //   refreshToken: { $in: [refreshToken] },
  // }).exec();
  const foundUser = await UsersDB.findOne({ refreshToken }).exec();
  console.log({ foundUser });
  // RefreshToken reuse detected!
  if (!foundUser) {
    await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); //forbidden
        console.log("attempted refresh token reuse!");
        const username = decoded.username;
        const hackedUser = await UsersDB.findOne({ username }).exec();
        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
        console.log(result);
      }
    );
    return res.sendStatus(403);
  }
  const newrefreshTokenArray = foundUser.refreshToken.filter(
    (token) => token !== refreshToken
  );
  //   verify refreshToken
  await jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err || foundUser.username !== decoded.username) {
        console.log("expired refreshToken - ", refreshToken);
        foundUser.refreshToken = [...newrefreshTokenArray];
        const result = await foundUser.save();
        console.log(result);
        return res.sendStatus(403);
      }
      // refreshToken still Valid
      const roles = Object.values(foundUser.roles);
      //   Create Jwts
      const accessToken = jwt.sign(
        { userInfo: { username: foundUser.username, roles: roles } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      const newRefreshToken = await jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      foundUser.refreshToken = [...newrefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
      });
      res.json({ accessToken });
    }
  );
};

module.exports = handleRefreshToken;
