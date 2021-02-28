const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const itemController = require('../controllers/itemControllers')


router.get("/search",itemController.find);
router.post("/create",itemController.create);

module.exports = router;