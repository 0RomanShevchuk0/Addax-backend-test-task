import { body, checkExact } from "express-validator"

export const userValidation = checkExact(
  [
    body("email").isEmail().withMessage("Email is not valid"),
    body("name")
      .isString()
      .isLength({ min: 3, max: 30 })
      .withMessage("Name length should be between 3 and 30 characters"),
    body("password")
      .isString()
      .isLength({ min: 5, max: 30 })
      .withMessage("Password length should be between 5 and 30 characters"),
  ],
  { message: "Unknown fields specified" }
)
