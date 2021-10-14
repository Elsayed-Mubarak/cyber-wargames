const createError = require("http-errors");

const Student = require("../student.model");
const securityModule = require("../../../security");
const catchAsync = require("../../../utils/catchAsync");

generateCredentials = async (req, res, next) => {
  if (
    req.session &&
    req.session.user_sid &&
    Date.parse(req.session.cookie._expires) > Date.now()
  ) {
    const student = await Student.findOne({
      userID: req.session.user_sid.userId,
    }).orFail((err) => {
      return next(createError(401, "not authorized"));
    });

    let token = await securityModule.buildTicket(student);
    await securityModule.setCookies(req, res, token);
    return res.status(200).json({ token });
  } else return res.status(204).json();

};

module.exports = generateCredentials;
