import jwt from "jsonwebtoken";
import StoreDB from "../model/Store.js";

const handleRefreshToken = async (req, res) => {
  const cookies = await req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = await cookies.jwt;
  // Clear the refreshToken here
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  //   Check for Store with the refreshToken
  const foundStore = await StoreDB.findOne({ refreshToken }).exec();
  // RefreshToken reuse detected!
  if (!foundStore) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); //forbidden
        console.log("attempted refresh token reuse!");
        const email = decoded.email;
        const hackedStore = await StoreDB.findOne({ email }).exec();
        hackedStore.refreshToken = [];
        await hackedStore.save();
      }
    );
    return res.sendStatus(403);
  }
  const newrefreshTokenArray = foundStore.refreshToken.filter(
    (token) => token !== refreshToken
  );
  //   verify refreshToken
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err || foundStore.email !== decoded.email) {
        console.log("expired refreshToken - ", refreshToken);
        foundStore.refreshToken = [...newrefreshTokenArray];
        const result = await foundStore.save();
        return res.sendStatus(403);
      }
      // refreshToken still Valid
      const roles = Object.values(foundStore.roles);
      //   Create Jwts
      const accessToken = jwt.sign(
        {
          storeInfo: {
            id: foundStore.id,
            email: foundStore.email,
            storeName: foundStore.storeName,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );
      const newRefreshToken = await jwt.sign(
        { email: foundStore.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      foundStore.refreshToken = [...newrefreshTokenArray, newRefreshToken];
      await foundStore.save();
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
      });
      res.status(200).json({ accessToken, storeName: foundStore.storeName });
    }
  );
};

export default handleRefreshToken;
