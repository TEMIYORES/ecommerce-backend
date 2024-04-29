import jwt from "jsonwebtoken";

const VerifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log({ authHeader });

  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid Token!" });
    req.username = decoded.storeInfo.storeName;
    req.roles = decoded.storeInfo.roles;
    next();
  });
};

export default VerifyJWT;
