const bcrypt = require("bcrypt");
const saltRounds = 10;
const Item = require('../services/Item');
const ItemInstance = new Item();

    exports.find = async (req, res, next) => {
        try{
            const createdItem = await ItemInstance.find(req.body);
            return res.send(createdItem);
        } catch (err){
            res.status(500).send(err);
        }
    }
    exports.create = async (req, res, next) => {
        try{
            const createdItem = await ItemInstance.create(req.body);
            return res.send(createdItem);
        } catch (err){
            res.status(500).send(err);
        }
    }

    