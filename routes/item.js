const express = require("express");
const router = express.Router();
const itemController = require('../controllers/itemController')


router.get("/findAll",itemController.findAll);
router.get("/findOne/:key/:value",itemController.findOne);
router.post("/create",itemController.create);
router.post("/update", itemController.update);
router.get("/delete/:id", itemController.delete);

module.exports = router;