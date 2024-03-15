const usersDB = require("../model/User");
const bcrypt = require("bcrypt");
const getAllUsers = async (req, res) => {
  const allUsers = await usersDB.find();
  if (!allUsers) return res.status(204).json({ message: "No Users found." });
  res.status(200).json(allUsers);
};
const createNewUser = async (req, res) => {
  const { username, password } = req.body;
  //   Check if username and password are passed in the request
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  // Check for duplicates
  const duplicate = await usersDB.findOne({ username }).exec();
  if (duplicate)
    return res
      .status(409)
      .json({ message: "User with the username already exists!" });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await usersDB.create({
      username,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.error(err.message);
  }
};
const updateUser = async (req, res) => {
  const { id, username, password } = req.body;
  //   Check if username and password are passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check for duplicates
  const foundUser = await usersDB.findOne({ _id: id }).exec();
  if (!foundUser)
    res.status(204).json({ message: `No user with userId ${id}` });
  try {
    if (username) foundUser.username = username;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      foundUser.password = hashedPassword;
    }
    const result = await foundUser.save();
    res.status(200).json(result);
  } catch (err) {
    console.error(err.message);
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.body;
  //   Check if username and password are passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check for duplicates
  const foundUser = await usersDB.findOne({ _id: id }).exec();
  if (!foundUser)
    res.status(204).json({ message: `No user with userId ${id}` });
  const result = await usersDB.deleteOne({ _id: id });
  res.status(200).json(result);
};
const getUser = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  //   Check if username and password are passed in the request
  if (!id)
    return res.status(400).json({ message: `Id parameter is required!` });
  // Check for duplicates
  const foundUser = await usersDB.findOne({ _id: id }).exec();
  if (!foundUser)
    return res.status(400).json({ message: `No user with the userId` });
  res.status(200).json({ username: foundUser.username });
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getUser,
};
