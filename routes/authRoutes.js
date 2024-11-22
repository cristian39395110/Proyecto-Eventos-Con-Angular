const express = require("express");
const { body, validationResult } = require("express-validator");
const { login, logout, checkSession } = require("../controllers/authController");

const router = express.Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("El email no tiene un formato válido"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    login(req, res);
  }
);

router.post("/logout", logout);
router.get("/check-session", checkSession);

module.exports = router;
