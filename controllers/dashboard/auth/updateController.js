import Store from "../../../model/Store.js";

const updateStore = async (req, res) => {
  const { email, phoneNumber, emailVerified, photoURL } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Email is required.",
    });
  }
  console.log("updating...");
  console.log(req.body);
  try {
    const store = await Store.findOne({ email }).exec();
    console.log({ store });
    if (phoneNumber && store.phoneNumber === null)
      store.phoneNumber = phoneNumber;
    if (emailVerified) store.emailVerified = emailVerified;
    if (photoURL && store.photoURL === null) store.photoURL = photoURL;
    await store.save();
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error updating info:", error);
    return res.sendStatus(400);
  }
};

export default updateStore;
