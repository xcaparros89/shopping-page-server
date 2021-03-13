const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const authController = require('../controllers/authController')

router.post("/signup",authController.register);
router.post("/login",authController.login);

module.exports = router;