const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);

const challenge = {
  category: joi
    .string()
    .trim()
    .required()
    .valid("web", "reverse", "forensic", "crypto", "machines")
    .messages({
      "string.empty": `category cannot be an empty field`,
      "string.valid": `invalid category must be one of web reverse forensic crypto machines`,
      "any.required": `category is required`,
    }),

  title: joi
    .string()
    .required()
    .trim()
    .pattern(/^[a-zA-Z-0-9 ]+$/)
    .messages({
      "string.base": `title must be consists of letters & numbers only`,
      "string.pattern.base": `title must be consists of letters & numbers only`,
      "string.empty": `title cannot be an empty field`,
      "any.required": `title is required`,
    }),
  level: joi.number().required().valid(1, 2, 3).messages({
    "number.base": `level must be one 1 or 2 or 3`,
    "number.empty": `level cannot be an empty field`,
    "any.required": `level is required`,
  }),
  points: joi.number().required().min(1).messages({
    "number.base": `points must be valid number and not empty`,
    "number.min": `points should be minimum {#limit}`,
    "number.empty": `points cannot be an empty field`,
    "any.required": `points is required`,
  }),
  author: joi
    .string()
    .trim()
    .required()
    .pattern(/^[a-zA-Z-0-9 ]+$/)
    .messages({
      "string.base": `author must be consists of letters & numbers only`,
      "string.pattern.base": `author must be consists of letters & numbers only`,
      "string.empty": `author cannot be an empty field`,
      "any.required": `author is required`,
    }),
  flag: joi
    .string()
    .trim()
    .required()
    .pattern(/^ASCWG{.*}$/)
    .messages({
      "string.base": "flag must start with ASCWG",
      "string.pattern.base": "flag must start with ASCWG",
      "string.empty": `flag cannot be an empty field`,
      "any.required": `flag is required`,
    }),
  description: joi.string().trim().allow(""),
  hints: joi.array(),

  externalLink: joi.string(),
};

const challengeUpdate = {
  category: joi
    .string()
    .trim()
    .valid("web", "reverse", "forensic", "crypto", "machines")
    .messages({
      "string.empty": `category cannot be an empty field`,
      "string.valid": `invalid category must be one of web reverse forensic crypto machines`,
    }),
  title: joi
    .string()
    .trim()
    .pattern(/^[a-zA-Z-0-9 ]+$/)
    .messages({
      "string.base": `title must be consists of letters & numbers only`,
      "string.pattern.base": `title must be consists of letters & numbers only`,
      "string.empty": `title cannot be an empty field`,
    }),
  level: joi.number().valid(1, 2, 3).messages({
    "number.base": `level must be one 1 or 2 or 3`,
    "number.empty": `level cannot be an empty field`,
  }),
  points: joi.number().min(1).messages({
    "number.base": `points must be valid number and not empty`,
    "number.min": `points should be minimum {#limit}`,
    "number.empty": `points cannot be an empty field`,
  }),
  author: joi
    .string()
    .trim()
    .pattern(/^[a-zA-Z-0-9 ]+$/)
    .messages({
      "string.base": `author must be consists of letters & numbers only`,
      "string.pattern.base": `author must be consists of letters & numbers only`,
      "string.empty": `author cannot be an empty field`,
    }),
  flag: joi
    .string()
    .trim()
    .pattern(/^ASCWG{.*}$/)
    .messages({
      "string.base": "flag must start with ASCWG",
      "string.pattern.base": "flag must start with ASCWG",
      "string.empty": `flag cannot be an empty field`,
    }),
  description: joi.string(),
  externalLink: joi.string(),
  hints: joi.array(),
  CTF: joi.objectId(),
};

const categorySchema = {
  category: joi
    .string()
    .required()
    .valid("web", "reverse", "forensic", "crypto", "machines")
    .trim()
    .messages({
      "string.valid": `invalid category must be one of web reverse forensic crypto machines`,
      "any.required": `category is required`,
    }),
};

module.exports = {
  challengeUpdate: joi.object(challengeUpdate),
  challenge: joi.object(challenge),
  category: joi.object(categorySchema),
  flag: joi.object({
    flag: challenge.flag,
  }),
  fileName: joi.object({
    fileName: joi.string().required(),
  }),
};
