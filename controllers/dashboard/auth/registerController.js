import bcrypt from "bcrypt";
import Store from "../../../model/Store.js";

const registerStore = async (req, res) => {
  const { email, password, storeName } = req.body;

  if (!email || !password || !storeName) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  //   Check for duplicate users in the database
  const duplicate = await Store.findOne({ email }).exec(); //findOne method need exec() if there is no callback

  if (duplicate) {
    return res.status(409).json({ message: "Email already exists." });
  }

  const duplicate2 = await Store.findOne({ storeName }).exec();
  if (duplicate2) {
    return res.status(409).json({ message: "Store name already exists." });
  }

  try {
    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await Store.create({
      ...req.body,
      password: hashedPassword,
    });
    console.log({ response });
    res.status(201).json({ message: `${storeName} registered successfully.` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export default registerStore;
