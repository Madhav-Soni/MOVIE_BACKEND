import { body, validationResult } from "express-validator";

// ── Login validation ─────────────────────────────
export const loginValidation = [

    body("email")
        .isEmail()
        .withMessage("Valid email required"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];

// ── Signup validation ────────────────────────────
export const signupValidation = [

    body("name")
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .isEmail()
        .withMessage("Valid email required"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];

// ── Validation result middleware ─────────────────
export const handleValidationErrors =
    (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
};