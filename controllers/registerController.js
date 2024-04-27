import StoreDB from "../model/Store.js"
import bcrypt from "bcrypt";

const handleNewStore = async (req, res) => {
  const { email, storeName, name, password } = req.body;
  console.log(req.body);
  if (!email || !name || !password || !storeName) {
    return res.status(400).json({
      message: "email, store name, username and password are required",
    });
  }
  //   Check for duplicate users in the database
  const duplicate = await StoreDB.findOne({ email }).exec(); //findOne method need exec() if there is no callback

  if (duplicate) {
    return res.status(409).json({ message: "Email already exists!" });
  }
  try {
    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStore = await StoreDB.create({
      email: email,
      password: hashedPassword,
      storeName: storeName,
      username: name,
    });

    console.log(newStore);
    res.status(201).json({ message: `${name} registered successfully!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default handleNewStore;
