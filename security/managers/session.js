const Config = require("../../config");
const Session = require("../../utils/session-model/session");
const Logger = require("../../utils/logger");
const timeFactory = require("../../modules/time-factory.js");

// timeFactory.cal('add', opts.ticketValidationInDays, 'day', new Date()),
// timeFactory.cal('add', config.overRequestBanDurationInHours, 'hours', new Date());\
function generateLoginDetails() {
  return {
    exp: timeFactory.to(
      "seconds",
      timeFactory.cal("add", Config.ticketValidationInDays, "day", new Date())
    ),
    iat: timeFactory.to("seconds", new Date()),
    maxLogins: Config.maxLogins,
  };
}
// generated next release time
function generateBlockDetails() {
  return {
    nextAt: timeFactory.cal(
      "add",
      Config.banDurationInHours,
      "minute",
      new Date()
    ),
  };
}

// check if login expired
function isLoginExpired(s) {
  const now = timeFactory.to("seconds", new Date());
  return s.exp < now;
}

module.exports = {
  // accepts user id and pass newly created session to the callback
  async login(user, ipAddress) {
    let newLogin;
    let record = await Session.findOne({ user: user._id });
    // if not session Document create new session Document for the first time -- {user, usage}
    if (!record) {
      record = new Session();
      record.createFor(user, ipAddress);
    }
    // push the user session in the session record (expiration, urn, iat)
    newLogin = record.newLogin(generateLoginDetails()); // return { urn, exp, iat }
    await record.save();
    return newLogin;
  },

  // works on the level of validation
  validateURN(req, cb) {
    // first check if user session exists
    Session.findOne({ user: req.userData._id }).exec(function (err, record) {
      // if exists
      if (record) {
        // check if user session usage is blocked and 
        if (record.usage.blocked && record.usage.nextAt > new Date()) {
          return cb({
            error:
              "user is blocked for session abuse and not ready for next usage",
            userMsg: "user is blocked for session abuse",
            valid: false,
            record,
          });
        }
        // if the time of block end reset to be unblocked
        if (record.usage.blocked && record.usage.nextAt < new Date()) {
          record.resetUsage();
        }
        // session number exists?
        const currentSession = record.getLogin(req.userData.urn);
        if (!currentSession)
          return cb({
            error: "login session number not found",
            userMsg: "login session expired session not exists",
            valid: false,
            record,
          });

        // session date is not expired
        if (isLoginExpired(currentSession)) {
          record.removeSession(currentSession);
          record.save();
          return cb({
            error: "login session expired sign in again",
            userMsg: "login session expired",
            valid: false,
            record,
          });
        }

        return cb({ error: null, valid: true, record });
      } else {
        return cb({
          error: "session record not found",
          userMsg: "login session expired not found",
          valid: false,
          record,
        });
      }
    });
  },
  // works on the level of usage and triggers the block
  // returns true false;
  hasVisits(req,record) {
    // not with in an hour - so everything resets
    if (
      timeFactory.difIn("hours", record.usage.span, new Date().toISOString()) >
      1
    ) {
      record.resetUsage();
      record.recordUsage();
      record.save();
      return true;
    } else {
      // exceeded limit rate per hour
      Logger.trace(
        "highlight",
        "is out of the span",
        `total visits ${record.usage.total} from ${req.socket.remoteAddress}`
      );
      if (record.usage.total >= Config.maxTicketUsagePerHour) {
        record.blockUsage(generateBlockDetails());
        record.save();
        return false;
      } else {
        // record another visit
        record.recordUsage();
        record.save();
        return true;
      }
    }
  },
  
  async clearSession(req) {
    let record = await Session.findOne({ user: req.userData._id });
    // return the specified session for this user
    const currentSession = record.getLogin(req.userData.urn);
    record.removeSession(currentSession);
    record.save();
  }
};
