import StoreDB from "../model/Store.js";

const handleLogout = async (req, res) => {
  // On Client Also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;
  //   Check for Store with the refreshToken
  const foundStore = await StoreDB.findOne({ refreshToken });
  if (!foundStore) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }
  console.log({ foundStore });
  foundStore.refreshToken = [];
  const result = await foundStore.save();
  console.log(result);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //secure:true - in https
  res.status(200).json({ message: "Logout successful" });
};

export default handleLogout;
