const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const authController = require('../controllers/authControllers')
const loginController = require('../controllers/loginController')

router.post("/signup",authController.register);
router.post("/login",loginController.login);

module.exports = router;