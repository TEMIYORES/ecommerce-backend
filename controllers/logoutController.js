const UserDB = require("../model/User");

const handleLogout = async (req, res) => {
  // On Client Also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;
  //   Check for user with the refreshToken
  const foundUser = await UserDB.findOne({ refreshToken });
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  //   Delete the RefreshToken from user
  //   const result = await UserDB.findOneAndUpdate(
  //     { refreshToken },
  //     { refreshToken: "" },
  //     {
  //       new: true,
  //       upsert: true, // Make this update into an upsert
  //     }
  //   );
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //secure:true - in https
  res.sendStatus(204);
};

module.exports = handleLogout;
