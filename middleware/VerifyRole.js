const VerifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const roles = req.roles;
    console.log(roles);
    console.log(allowedRoles);
    if (!roles) return res.sendStatus(401);
    const result = roles
      .map((role) => allowedRoles.includes(role))
      .find((val) => val === true);
    if (!result) return res.sendStatus(401);
    next();
  };
};
module.exports = VerifyRoles;
