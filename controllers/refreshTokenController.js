const jwt = require("jsonwebtoken");
const UsersDB = require("../model/User");

const handleRefreshToken = async (req, res) => {
  const cookies = await req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = await cookies.jwt;
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
        const email = decoded.email;
        const hackedUser = await UsersDB.findOne({ email }).exec();
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
      console.log("error", err);
      console.log("founder user email", foundUser.email);
      console.log("decoded email", decoded.email);
      if (err || foundUser.email !== decoded.email) {
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
      foundUser.refreshToken = [...newrefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
      });
      res.status(200).json({ accessToken });
    }
  );
};

module.exports = handleRefreshToken;
