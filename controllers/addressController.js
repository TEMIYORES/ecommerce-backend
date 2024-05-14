import AddressDB from "../model/Address.js";

const saveAddressData = async (req, res) => {
  const {
    storeId,
    accountId,
    name,
    email,
    phoneNumber,
    streetAddress,
    city,
    postalCode,
    country,
  } = req.body;
  console.log(req.body);
  if (!storeId) {
    return res.status(400).json({
      message: "store Id and all other fields are required",
    });
  }
  const foundAddress = await AddressDB.findOne({
    storeId,
    accountId,
  }).exec(); //findOne method need exec() if there is no callback
  if (foundAddress) {
    foundAddress.name = name;
    foundAddress.email = email;
    foundAddress.phoneNumber = phoneNumber;
    foundAddress.streetAddress = streetAddress;
    foundAddress.city = city;
    foundAddress.postalCode = postalCode;
    foundAddress.country = country;

    await foundAddress.save();
    return res
      .status(201)
      .json({ message: `${name} address saved successfully!` });
  }

  try {
    const newAddress = await AddressDB.create({
      storeId,
      accountId,
      name,
      email,
      phoneNumber,
      streetAddress,
      city,
      postalCode,
      country,
    });

    console.log({ newAddress });
    return res
      .status(201)
      .json({ message: `${name} address saved successfully!` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const getAddressData = async (req, res) => {
  const { storeId, accountId } = req.params;
  console.log(req.params);
  if (!storeId || !accountId) {
    return res.status(400).json({
      message: "store Id and Account Id required, please reload the page.",
    });
  }
  const foundAddress = await AddressDB.findOne({
    storeId,
    accountId,
  }).exec(); //findOne method need exec() if there is no callback

  if (!foundAddress) {
    return res.status(400).json({ message: `No address found` });
  }
  // const result = {
  //   name: foundAddress.name,
  //   email: foundAddress.email,
  //   phoneNumber: foundAddress.phoneNumber.phone,
  //   city: foundAddress.city,
  //   postalCode: foundAddress.postalCode,
  //   streetAddress: foundAddress.streetAddress,
  //   country: foundAddress.country,
  // };
  return res.status(200).json(foundAddress);
};

export { saveAddressData, getAddressData };
