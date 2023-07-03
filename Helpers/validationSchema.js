// const joi = require("joi");

// const schema = joi.object({
//   email: joi
//     .string()
//     .pattern(new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
//     .required(),

//   username: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),

//   password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
//   password_confirm: joi.ref("password"),
// });

// const passwordSchema = joi.object({
//   password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
//   password_confirm: joi.ref("password"),
// });

// const verifySignUp = async (req, res, next) => {
//   const { email, username, role, password, password_confirm } = req.body;
//   try {
//     await schema.validateAsync({ email, username, password, password_confirm });
//   } catch (err) {
//     return next(err);
//   }
//   next();
// };

// module.exports = { schema, verifySignUp, passwordSchema };
const joi = require("joi");

const loginSchema = joi.object({
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .required()
    .label("Email"),
  password: joi.string().min(3).max(30).required().label("Password"),
});

const verifyLogin = async (req, res, next) => {
  try {
    console.log("Validating login...");
    await loginSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    console.error("Login validation error:", err);
    return next(err);
  }
};

const signupSchema = joi.object({
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .required()
    .label("Email"),
  username: joi.string().alphanum().min(3).max(30).required().label("Username"),
  password: joi.string().min(3).max(30).required().label("Password"),
  password_confirm: joi
    .string()
    .valid(joi.ref("password"))
    .required()
    .label("Password Confirmation")
    .messages({ "any.only": "Passwords must match" }),
});

const verifySignUp = async (req, res, next) => {
  const { email, username, password, password_confirm } = req.body;
  try {
    await signupSchema.validateAsync({
      email,
      username,
      password,
      password_confirm,
    });
  } catch (err) {
    return next(err);
  }
  next();
};

module.exports = { loginSchema, verifyLogin, signupSchema, verifySignUp };
