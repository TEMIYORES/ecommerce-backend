import jwt from "jsonwebtoken";
import AccountDB from "../model/Account.js";

const handleAccountRefreshToken = async (req, res) => {
  const cookies = await req.cookies;
  console.log({ cookies });
  if (!cookies?.account_jwt) return res.sendStatus(401);
  const AccountRefreshToken = await cookies.account_jwt;
  // Clear the AccountRefreshToken here
  res.clearCookie("account_jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  //   Check for Account with the AccountRefreshToken
  const foundAccount = await AccountDB.findOne({
    refreshToken: AccountRefreshToken,
  }).exec();
  console.log({ foundAccount });
  // AccountRefreshToken reuse detected!
  if (!foundAccount) {
    jwt.verify(
      AccountRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); //forbidden
        console.log("attempted refresh token reuse!");
        const email = decoded.email;
        const hackedAccount = await AccountDB.findOne({
          email,
        }).exec();
        hackedAccount.AccountRefreshToken = [];
        await hackedAccount.save();
      }
    );
    return res.sendStatus(403);
  }
  const newAccountRefreshTokenArray = foundAccount.refreshToken.filter(
    (token) => token !== AccountRefreshToken
  );
  //   verify AccountRefreshToken
  jwt.verify(
    AccountRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err || foundAccount.email !== decoded.email) {
        console.log("expired AccountRefreshToken - ", AccountRefreshToken);
        foundAccount.AccountRefreshToken = [...newAccountRefreshTokenArray];
        const result = await foundAccount.save();
        return res.sendStatus(403);
      }
      // AccountRefreshToken still Valid
      const roles = Object.values(foundAccount.roles).filter(Boolean);
      console.log({ roles });
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
      const newAccountRefreshToken = await jwt.sign(
        { email: foundAccount.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      foundAccount.refreshToken = [
        ...newAccountRefreshTokenArray,
        newAccountRefreshToken,
      ];
      await foundAccount.save();
      res.cookie("account_jwt", newAccountRefreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
      });
      res.status(200).json({ accessToken });
    }
  );
};

export default handleAccountRefreshToken;
