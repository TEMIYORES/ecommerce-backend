import UserDB from "../model/User.js";

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
  console.log({ foundUser });
  foundUser.refreshToken = [];
  const result = await foundUser.save();
  console.log(result);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //secure:true - in https
  res.status(200).json({ message: "Logout successful" });
};

export default handleLogout;
