const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const authController = require('../controllers/authControllers')


router.post("/signup",authController.register);

module.exports = router;