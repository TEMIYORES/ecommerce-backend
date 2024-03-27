const VerifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const roles = req.roles;

    if (!roles) return res.sendStatus(401);
    const result = roles
      .map((role) => allowedRoles.includes(role))
      .find((val) => val === true);
    if (!result) return res.sendStatus(401);
    next();
  };
};
export default VerifyRoles;
