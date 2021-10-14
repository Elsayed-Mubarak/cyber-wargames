const multer = require("multer");
const Config = require("./../config");
const Security = require("./../security");
const winston = require('./../config/winston');

const Error404 = (req, res, next) => {
  if (Config.canUseCustomErrorPages) {
    // Handle 404
    res.status(404).json({ title: "404: File Not Found" });
    Security.log404(req);
  }
};

// global errors 500, 400, 401, 409
// 400	BadRequest
// 401	Unauthorized
// 402	PaymentRequired
// 403	Forbidden
// 405	MethodNotAllowed
// 409	Conflict
// 408	RequestTimeout
// 429	TooManyRequests
// 501	NotImplemented
// 503	ServiceUnavailable
// 504	GatewayTimeout
// 423	Locked
// 413	PayloadTooLarge
// 411	LengthRequired
const Error500 = (error, req, res, next) => {
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  // add this line to include winston logging
  //  winston.combinedFormat(error, req, res);
  winston.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${req.socket.remoteAddress}`);

  if (error.status === 500 || error.status === undefined) {
    return res.status(500).json({ message: "500: Internal Server Error", error: error.message });
  } else {
    return res.status(error.status).json({ message: error.message, error: error.message });
  }
};

const MulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(500).json({
      message: err.message,
    });
  } else next(err);
};


module.exports = {
  Error404,
  Error500,
  MulterError
};
