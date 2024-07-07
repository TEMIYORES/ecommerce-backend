import Store from "../../../model/Store.js";

const loginStore = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }
  try {
    const account = await Store.findOne({ email }).exec();
    if (!account) {
      return res.status(404).json({ message: "Store account not found." });
    }
    if (account) {
      return res.status(200).json(account);
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error finding account:", error);
    return res.sendStatus(400);
  }
};
const verifyAccount = async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({
      message: "email is required",
    });
  }
  try {
    const account = await Store.findOne({ email }).exec();
    if (!account) {
      return res.status(200).json({ doesStoreExist: false });
    }
    if (account.email) {
      return res.status(200).json({ doesStoreExist: true });
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error finding account:", error);
    return res.sendStatus(400);
  }
};
export { loginStore, verifyAccount };
