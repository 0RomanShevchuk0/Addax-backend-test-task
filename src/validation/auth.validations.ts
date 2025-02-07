import { body, checkExact } from "express-validator"

export const authValidation = checkExact(
  [
    body("email").isEmail().withMessage("Email is not valid"),
    body("password")
      .isString()
      .isLength({ min: 5, max: 30 })
      .withMessage("Password length should be between 5 and 30 characters"),
  ],
  { message: "Unknown fields specified" }
)
