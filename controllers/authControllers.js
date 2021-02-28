const bcrypt = require("bcrypt");
const saltRounds = 10;
const Register = require('../services/Register');
const RegisterInstance = new Register();

    exports.register = async (req, res, next) => {
        try{
            const createdUser = await RegisterInstance.create(req.body);
            return res.send(createdUser);
        } catch (err){
            res.status(500).send(err);
        }
    }