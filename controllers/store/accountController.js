import Account from "../../model/Account.js";
import bcrypt from "bcrypt";

const createAccount = async (req, res) => {
  console.log(req.body);
  const { storeId, accountName, fullName, email, password, phoneNumber } = req.body;

  if ((!storeId, !accountName, !email || !fullName || !password)) {
    return res.status(400).json({
      message:
        "account Id, account Name and all other fields are required, please reload.",
    });
  }

  //   Check for duplicate users in the database
  const duplicate = await Account.findOne({
    storeId,
    $or: [{ email }, { phoneNumber }],
  }).exec(); //findOne method need exec() if there is no callback

  if (duplicate) {
    return res
      .status(409)
      .json({ message: "Account with email and phone number already exists!" });
  }

  try {
    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = await Account.create({
      ...req.body,
      password: hashedPassword,
    });

    console.log({ newAccount });
    return res
      .status(201)
      .json({ message: `${fullName} account registered successfully!` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const loginAccount = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }
  try {
    const account = await Account.findOne({ storeId, email }).exec();
    if (!account) {
      return res.status(404).json({ message: "Account account not found." });
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
    const account = await Account.findOne({ storeId, email }).exec();
    if (!account) {
      return res.status(200).json({ doesAccountExist: false });
    }
    if (account.email) {
      return res.status(200).json({ doesAccountExist: true });
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error finding account:", error);
    return res.sendStatus(400);
  }
};

const updateAccount = async (req, res) => {
  const { storeId, email, phoneNumber, emailVerified, photoURL } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Email is required.",
    });
  }
  console.log("updating...");
  console.log(req.body);
  try {
    const account = await Account.findOne({ storeId, email }).exec();
    console.log({ account });
    if (phoneNumber && account.phoneNumber === null)
      account.phoneNumber = phoneNumber;
    if (emailVerified) account.emailVerified = emailVerified;
    if (photoURL && account.photoURL === null) account.photoURL = photoURL;
    await account.save();
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error updating info:", error);
    return res.sendStatus(400);
  }
};
export { createAccount, loginAccount, verifyAccount, updateAccount };
