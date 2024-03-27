import { LogEvents } from "./LogEvent.js";

const errHandler = (err, req, res, next) => {
  LogEvents(`${err.name}: ${err.message}`, "errLog.txt");
  res.status(500).send(err.message);
};

export default errHandler;
