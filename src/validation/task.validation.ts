import { body, checkExact } from "express-validator"

export const taskValidation = checkExact(
  [
    body("name")
      .isString()
      .withMessage("Name must be a string")
      .isLength({ min: 3, max: 30 })
      .withMessage("Name length should be between 3 and 30 characters"),

    body("date").isDate().withMessage("Date must be in YYYY-MM-DD format"),
    body("notes")
      .optional({ values: "null" })
      .isString()
      .withMessage("Notes must be a string if provided"),
    body("color")
      .optional({ values: "null" })
      .isString()
      .withMessage("Color must be a string if provided"),
    body("id").optional().isString().withMessage("Id must be a string if provided"),
  ],
  { message: "Unknown fields specified" }
)
