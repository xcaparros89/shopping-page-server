const bcrypt = require("bcrypt");
const saltRounds = 10;
const Category = require('../services/Category');
const CategoryInstance = new Category();

    exports.findAll = async (req, res, next) => {
        try{
            const allCategories = await CategoryInstance.findAll();
            return res.send(allCategories);
        } catch (err){
            res.status(500).send(err);
        }
    }
    exports.findOne = async (req, res, next) => {
        try{
            const createdCategory = await CategoryInstance.findOne({[req.params.key]:req.params.value});
            return res.send(createdCategory);
        } catch (err){
            res.status(500).send(err);
        }
    }
    exports.create = async (req, res, next) => {
        try{
            const createdCategory = await CategoryInstance.create(req.body);
            return res.send(createdCategory);
        } catch (err){
            res.status(500).send(err);
        }
    }

    exports.update = async (req, res, next) => {
        try{
            const updatedCategory = await CategoryInstance.update(req.body);
            return res.send(updatedCategory);
        } catch (err){
            res.status(500).send(err);
        }
    }
    exports.delete = async (req, res, next) => {
        try{
            const deletedCategory = await CategoryInstance.delete(req.params.id);
            return res.send(deletedCategory);
        } catch (err){
            res.status(500).send(err);
        }
    }