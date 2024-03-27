const UserDB = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({ message: "email, name and password are required" });
  }
  //   Check for duplicate users in the database
  const duplicate = await UserDB.findOne({ email }).exec(); //findOne method need exec() if there is no callback

  if (duplicate) {
    return res.status(409).json({ message: "Email already exists!" });
  }
  try {
    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create & store new user
    // const newUser = new UserDB({
    //     email: email,
    //     password: hashedPassword,
    // });
    // const result =await newUser.save()

    const newUser = await UserDB.create({
      email: email,
      password: hashedPassword,
      name: name,
    });

    console.log(newUser);
    res.status(201).json({ message: "New user created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = handleNewUser;
