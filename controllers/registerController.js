const UserDB = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password are required" });
  }
  //   Check for duplicate users in the database
  const duplicate = await UserDB.findOne({ username }).exec(); //findOne method need exec() if there is no callback

  if (duplicate) {
    return res.status(409).json({ message: "username already exists!" });
  }
  try {
    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create & store new user
    // const newUser = new UserDB({
    //     username: username,
    //     password: hashedPassword,
    // });
    // const result =await newUser.save()

    const newUser = await UserDB.create({
      username: username,
      password: hashedPassword,
    });

    console.log(newUser);
    res.status(201).json({ success: "New user created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = handleNewUser;
