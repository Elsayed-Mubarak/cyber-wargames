const jwt = require("jsonwebtoken");

const config = require("../../config");

// check if ticket exists
function isExists(req) {
  if (req.headers.authorization && req.headers.authorization !== undefined) {
    return true;
  }
  return false;
}

// sign ticket
function signTicket(data) {
  return jwt.sign(data, config.PRIVATEKEY, {
    algorithm: "RS256",
  });
}


// return decodedString/false
function verifyTicket(req) {
  return jwt.verify(req.headers.authorization, config.PUBLICKEY, {
    algorithm: "RS256",
  });
}

function verifySocket(token) {
  return jwt.verify(token, config.PUBLICKEY, {
    algorithm: "RS256",
  });
}

module.exports = {
  isExists,
  sign: signTicket,
  verify: verifyTicket,
  verifySocket,
};
