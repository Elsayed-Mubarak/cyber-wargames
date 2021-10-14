const redis = require("redis");
const geoip = require("geoip-lite");

const Logger = require("../../utils/logger");
const Config = require("../../config");
const requestIp = require("request-ip");
// const Say = require('../../langs');

const client = redis.createClient({
  host: (process.env.NODE_ENV == 'production') ? process.env.RedisHost : "127.0.0.1",
  port: 6379
});

client.on("error", function (err) {
  Logger.trace("danger", "anit-scan REDIS", err, true);
});

const dayInSec = 86400;
const prefix = "monit404:";
const prefixBlocked = "blocked:";

const checkMax = 4;
const scanMax = 7;

module.exports = {
  log404(req) {
    // get client ip
    const ip = requestIp.getClientIp(req);
    // reference to monit and block
    const ipToMonit = prefix + ip;
    const ipToBlock = prefixBlocked + ip;

    // request monit
    client.hgetall(ipToMonit, function (err, object) {
      // console.log(object);
      if (err) console.log(err);

      if (object) {
        if (object.count >= scanMax) {
          console.log(`${ip} blocked for scanning`);
          client.hmset(ipToBlock, object);
          client.expireat(
            ipToBlock,
            parseInt(+new Date() / 1000) + dayInSec * Config.scanBlockInDays
          );
        }
        // saving visit
        object.count++;
        client.hmset(ipToMonit, object);
      } else {
        client.hmset(ipToMonit, { count: 1 });
        client.expireat(ipToMonit, parseInt(+new Date() / 1000) + dayInSec);
      }
    });
  },
  preventBlocked(req, res, next) {
    const ipToBlock = prefixBlocked + requestIp.getClientIp(req);
    client.hgetall(ipToBlock, function (err, object) {
      if (object) {
        return res.status(429).json({ message: "Your IP blocked for Scanning" });
      } else {
        next();
      }
    });
  },
};
