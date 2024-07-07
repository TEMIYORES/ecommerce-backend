import Settings from "../../model/Setting.js";

const handleSettings = async (req, res) => {
  const { storeId, featuredProductId, shippingFees } = req.body;
  //   Check if Storename and password are passed in the request
  if (!storeId)
    return res.status(400).json({
      message: `StoreId parameter is required, please reload or login.`,
    });
  // Check for duplicates
  const settingDoc = await Settings.findOne({ storeId }).exec();

  if (settingDoc) {
    if (featuredProductId)
      settingDoc.settings.featuredProductId = featuredProductId;
    if (shippingFees) settingDoc.settings.shippingFees = shippingFees;
    await settingDoc.save();
    res.status(200).json({ message: "Settings saved successfully" });
  } else {
    const settingQuery = {
      storeId,
    };
    settingQuery["settings." + "featuredProductId"] = featuredProductId;
    settingQuery["settings." + "shippingFees"] = shippingFees;
    const result = await Settings.create(settingQuery);
    res.status(201).json(result);
  }
};
const getSettings = async (req, res) => {
  const { storeId } = req.params;
  console.log({ storeId });
  //   Check if Storename and password are passed in the request
  if (!storeId || storeId === "null") {
    return res.status(400).json({
      message: `StoreId parameter is required, please reload or login.`,
    });
  }

  // Check for duplicates
  const settingDoc = await Settings.findOne({ storeId }).exec();
  console.log({ settingDoc });

  if (settingDoc) {
    res.status(201).json(settingDoc);
  } else {
    const settingQuery = {
      storeId,
    };
    const result = await Settings.create(settingQuery);
    console.log({ result });
    res.status(201).json(result);
  }
};

const getShippingFee = async (req, res) => {
  const { storeId, state } = req.params;
  console.log({ state });
  //   Check if Storename and password are passed in the request
  if (!storeId)
    return res.status(400).json({
      message: `StoreId parameter is required, please reload or login.`,
    });
  const settingDoc = await Settings.findOne({ storeId }).exec();
  let price = "";
  if (settingDoc) {
    const parsedState =
      state[0].toUpperCase() + state.substring(1).toLowerCase();
    price = settingDoc.settings.shippingFees[parsedState];
    res.status(200).json(price);
  } else {
    return res.status(400).json({
      message: `StoreId parameter is required does not match any store`,
    });
  }
};

export { handleSettings, getSettings, getShippingFee };
