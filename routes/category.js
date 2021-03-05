const express = require("express");
const router = express.Router();

const categoryController = require('../controllers/categoryController')


router.get("/findAll",categoryController.findAll);
router.get("/findOne/:key/:value",categoryController.findOne);
router.post("/create",categoryController.create);
router.post("/update", categoryController.update);
//add or remove category
module.exports = router;