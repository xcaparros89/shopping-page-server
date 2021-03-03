const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const itemController = require('../controllers/itemController')


router.get("/search",itemController.find);
router.post("/create",itemController.create);
//add or remove category
module.exports = router;