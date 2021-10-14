const joi = require('joi')

const paginationSchema = {
  pageNo: joi
    .string()
    .trim()
    .pattern(/^[0-9]*$/) // find a way to limit the number according to number of documents
    .message('Enter a valid number'),
  limitNo: joi
    .string()
    .trim()
    .pattern(/^[0-9]*$/) // find a way to limit the number according to number of documents
    .message('Enter a valid number'),
}
const fieldSchema = {
  fieldName: joi
    .string()
    .required()
    .trim()
    .pattern(/^[a-zA-Z0-9 ]+$/)
    .min(2)
    .max(100),
}

const signupSchema = {
  name: joi
    .string()
    .required()
    .trim()
    .pattern(/^[a-zA-Z ]+$/)
    .min(3)
    .max(50)
    .messages({
      'string.base': `student name must be consists of letters only`,
      'string.empty': `student name cannot be an empty field`,
      'string.min': `student name should have a minimum length of {#limit} (letters)`,
      'string.max': `student name should have a maximum length of {#limit} (letters)`,
      'string.pattern.base': `student name must be consists of letters only`,
      'any.required': `student name is required`,
    }),

  militaryId: joi
    .string()
    .length(6)
    .regex(/^[0-9]{1,6}$/),
  password: joi
    .string()
    .required()
    .trim()
    .pattern(/(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    .min(8)
    .messages({
      'string.base': `password must be at least a minimum of 8 characters long with 1 small letter, 1 capital letter, 1 number and 1 special character`,
      'string.empty': `password cannot be an empty field`,
      'string.min': `password should have a minimum length of {#limit}`,
      'string.pattern.base': `password must be at least a minimum of 8 characters long with 1 small letter, 1 capital letter, 1 number and 1 special character`,
      'any.required': `password is required`,
    }),
  squadNumber: joi.number().required().max(5000),
}

const loginSchema = {
  militaryId: joi
    .string()
    .length(6)
    .regex(/^[0-9]{1,6}$/)
    .message('Invalid militaryId'),
  password: joi.string().required(),
}

const changePasswordSchema = {
  oldPassword: joi
    .string()
    .required()
    .trim()
    .pattern(/(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    .min(8)
    .messages({
      'string.base': `old password invalid`,
      'string.empty': `old password cannot be an empty field`,
      'string.pattern.base': `old password invalid`,
      'any.required': `old password is required`,
    }),
  newPassword: joi
    .string()
    .required()
    .trim()
    .pattern(/(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    .min(8)
    .messages({
      'string.base': `new password must be at least a minimum of 8 characters long with 1 small letter, 1 capital letter, 1 number and 1 special character`,
      'string.empty': `new password cannot be an empty field`,
      'string.pattern.base': `new password must be at least a minimum of 8 characters long with 1 small letter, 1 capital letter, 1 number and 1 special character`,
      'any.required': `new password is required`,
    }),
}

module.exports = {
  signup: joi.object(signupSchema),
  login: joi.object(loginSchema),
  pagination: joi.object(paginationSchema),
  changePassword: joi.object(changePasswordSchema),
  studentName: joi.object({ name: signupSchema.name }),
  resetPassword: joi.object({ password: signupSchema.password }),
  deleteSquad: joi.object({
    squadNumber: signupSchema.squadNumber,
    password: signupSchema.password,
  }),
  squadNumber: joi.object({
    squadNumber: signupSchema.squadNumber,
  }),
  fieldName: joi.object({ fieldName: fieldSchema.fieldName }),
  militaryId: joi.object({ militaryId: loginSchema.militaryId }),
  adminSignup: joi.object({
    name: signupSchema.name,
    militaryId: signupSchema.militaryId,
    password: signupSchema.password,
  }),
}
