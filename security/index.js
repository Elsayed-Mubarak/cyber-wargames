const jwt = require('jsonwebtoken')
const csrf = require('csurf')
const MongoStore = require('rate-limit-mongo')
const rateLimit = require('express-rate-limit') // to prevent many of requests from the same ip and prevent fro

const sessionManager = require('./managers/session')
const roleManager = require('./managers/role')
const ticketManager = require('./managers/ticket')
const antiScanManager = require('./managers/anti_scan')
const Logger = require('../utils/log-model/log')
const Config = require('../config')

function failCallback(req, res, next, nextValidRequestDate) {
  return res.status(429).json({ error: 'Say.error.ipBlocked' })
}
function handleStoreError(error) {
  Logger.trace('vivid', 'security', error, true)
}

function preventAbuseFunction(fn, options) {
  if (Config.preventAbuse === true) {
    return fn
  } else {
    if (options && options.next === false) {
      return function () { }
    }
    return function (req, res, next) {
      return next()
    }
  }
}

const limiter = rateLimit({
  max: Config.maxTicketUsagePerHour,
  windowMs: 60 * 60 * 1000, // try after one hour
  message: 'Too many requests from this IP, please try again after an hour',
  statusCode: 429, // 429 status = Too Many Requests (RFC 6585)
  headers: true, //Send custom rate limit header with limit and remaining
  // allows to create custom keys (by default user IP is used)
  keyGenerator: function (req, res) {
    if (req.headers.authorization && jwt.decode(req.headers.authorization)) {
      let userData = jwt.decode(req.headers.authorization)
      return userData._id
    } else {
      return req.connection.remoteAddress
    }
  },
  skip: function (/*req, res*/) {
    return false
  },
  handler: function (req, res /*next*/) {
    res.status(429).json({
      message:
        'Too Many requests from this team...Team Blocked...try again after one hour',
    })
  },
  store: new MongoStore({
    uri: Config.dbURI,
    collectionName: 'block',
    expireTimeMs: 60 * 60 * 1000,
    errorHandler: console.error.bind(null, 'rate-limit-mongo'),
  }),
})

module.exports = {
  masking(app) {
    app.use(function (req, res, next) {
      res.setHeader('X-Powered-By', 'PHP/5.1.2')
      next()
    })
  },
  log404: preventAbuseFunction(antiScanManager.log404, { next: false }),
  preventBlocked: preventAbuseFunction(antiScanManager.preventBlocked),
  async buildTicket(user, ipAddress) {
    let userSessionData = await sessionManager.login(user, ipAddress)
    userSessionData = {
      ...userSessionData,
      _id: user._id,
      role: user.role,
      u_id: user.userID,
    }
    // sign user data (payload) with jwt and return the token
    return ticketManager.sign(userSessionData)
  },
  auth(allowedRoles) {
    return async function (req, res, next) {
      try {
        if (!req.headers.authorization) {
          req.userData = jwt.verify(
            req.signedCookies.auth_token,
            Config.PUBLICKEY,
          )
        } else {
          req.userData = jwt.verify(req.headers.authorization, Config.PUBLICKEY)
        }

        // check user role have credientials to access specify api
        //console.log(' ........... ',allowedRoles);
        //console.log(' .req.......... ',req.userData.role);
        if (!roleManager.isRoleAllowed(req, allowedRoles))
          return res
            .status(401)
            .json({ message: 'Not Authorized User not allowed to access' })

        sessionManager.validateURN(req, function (opts) { // return cb error or the session record
          if (!opts.valid)
            return res.status(401).json({ message: opts.userMsg, error: opts.error })
          // else if valid check visits
          if (!sessionManager.hasVisits(req, opts.record))
            return res.status(401).json({
              message: 'You are blocked Try again later After 1 hour',
            })
          next()
        })
      } catch (error) {
        return res.status(401).json({ message: 'Not authorized user' })
      }
    }
  },
  validateTempToken(req, res, next) {
    try {
      if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Not authorized user' })
      }
      const tokenDecodedData = jwt.verify(
        req.headers.authorization,
        Config.tempTokenSecret,
      )
      req.userData = tokenDecodedData
      next()
    } catch (error) {
      return res.status(401).json({ message: 'OTP validation time expired' })
    }
  },
  limiter,
  validateSession(req, res, next) {
    // validate session exists and refresh the session
    if (req.session && !req.session.user_sid) {
      req.session.user_sid = {
        userId: req.userData.u_id,
        role: req.userData.role,
      }
      // req.session.save();
      req.session.reload(function (err) {
        // session updated
      })

      res.cookie('lang', 'en', {
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        signed: false,
      })
    } else if (req.session && req.session.user_sid) {
      if (Date.parse(req.session.cookie._expires) < Date.now()) {
        return res.status(401).json({
          error: 'Login again session invalid',
          message: 'Login again session expired',
        })
      }
    }
    next()
  },
  csrfProtection: csrf({
    cookie: {
      path: '/',
      secure: Config.currentEnv == 'development' ? false : true,
      signed: false,
      httpOnly: true,
      sameSite: true,
    },
  }),
  setCookies(req, res, token) {
    res.cookie('lang', 'en', {
      httpOnly: true,
      secure: Config.currentEnv == 'production',
      signed: false,
      // sameSite: true,
    })

    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: +Config.ticketValidationInDays * 24 * 60 * 60 * 1000,
      secure: Config.currentEnv == 'production',
      signed: true,
      // sameSite: true,
    })
  },
  removeSession(req) {
    if (!req.headers.authorization) {
      req.userData = jwt.verify(
        req.signedCookies.auth_token,
        Config.PUBLICKEY,
      )
    } else {
      req.userData = jwt.verify(req.headers.authorization, Config.PUBLICKEY)
    }
    sessionManager.clearSession(req)
  }
}
