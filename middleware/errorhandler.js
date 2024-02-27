const { LogEvents } = require("./LogEvent");

const errHandler = (err, req, res, next) => {
  LogEvents(`${err.name}: ${err.message}`, "errLog.txt");
  res.status(500).send(err.message);
};

module.exports = errHandler;
