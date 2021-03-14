const Item = require('../services/Item');
const ItemInstance = new Item();

    exports.findAll = async (req, res, next) => {
        try{
            const allItems = await ItemInstance.findAll();
            return res.send(allItems);
        } catch (err){
            res.status(500).send(err);
        }
    }

    exports.findOne = async (req, res, next) => {
        try{
            console.log({[req.params.key]:req.params.value})
            const createdItem = await ItemInstance.findOne({[req.params.key]:req.params.value});
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

        exports.update = async (req, res, next) => {
        try{
            const updatedItem = await ItemInstance.update(req.body);
            return res.send(updatedItem);
        } catch (err){
            res.status(500).send(err);
        }
    }

    exports.delete = async (req, res, next) => {
        try{
            const deletedItem = await ItemInstance.delete(req.params.id);
            return res.send(deletedItem);
        } catch (err){
            res.status(500).send(err);
        }
    }