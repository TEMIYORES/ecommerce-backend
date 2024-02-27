const jwt = require("jsonwebtoken");
const UserDB = require("../model/User");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  //   Check for user with the refreshToken
  const foundUser = await UserDB.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403);
  //   verify Jwt
  await jwt.verify(
    foundUser.refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.username !== decoded.username) {
        res.sendStatus(403);
      }
      const roles = Object.values(foundUser.roles);
      //   Create Jwts
      const accessToken = jwt.sign(
        { userInfo: { username: foundUser.username, roles: roles } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2m" }
      );
      res.json({ accessToken });
    }
  );
};

module.exports = handleRefreshToken;
