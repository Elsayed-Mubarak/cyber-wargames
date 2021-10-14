const createError = require("http-errors");

const Student = require("../student.model");
const { login: loginSchema } = require("../student.validation");
const securityModule = require("../../../security");
const catchAsync = require("../../../utils/catchAsync");


login = async (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ message: error.message.replace(/"/g, ""), status: 400 });

  const student = await Student.findOne()
    .byMilitaryId(value.militaryId)
    .select("militaryId password isVerified userID role _id");

  if (!student) return next(createError(401, "Invalid email or password"));
  const isPasswordValid = await student.isPasswordValid(value.password);
  if (!isPasswordValid)
    return next(createError(401, "Invalid email or password"));

  if (!student.isVerified)
    return res.status(201).json({
      temp: student.signTempJWT(),
      verified: false,
      message: "Email  not verified please check email address",
    });

  let token = await securityModule.buildTicket(student, req.socket.remoteAddress);
  req.session.user_sid = { userId: student.userID, role: student.role };
  req.session.save();

  await securityModule.setCookies(req, res, token);

  return res.status(200).json({
    token,
    verified: true,
    role: student.role
  });
};

module.exports = login;
