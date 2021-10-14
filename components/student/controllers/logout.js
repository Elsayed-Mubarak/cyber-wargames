const Security = require('./../../../security')

async function logout(req, res, next) {
  if (req.session.user_sid) {
    res.clearCookie('auth_token')
    res.clearCookie('session_sid')
    res.clearCookie('ct0');
    await Security.removeSession(req);
    return res.status(200).json({ status: 'ok' })
  }
  return res.status(304).json({})
}

module.exports = logout
