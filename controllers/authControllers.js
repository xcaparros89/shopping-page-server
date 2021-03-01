const bcrypt = require("bcrypt");
const saltRounds = 10;
const Register = require('../services/Register');
const RegisterInstance = new Register();
const Login = require('../services/Login');
const LoginInstance = new Login();

    exports.register = async (req, res, next) => {
        try{
            console.log('authControllers')
            const createdUser = await RegisterInstance.create(req.body);
            return res.send(createdUser);
        } catch (err){
            res.status(500).send(err);
        }
    }

    exports.login = async (req, res, next) => {
        try{
            const findUser = await LoginInstance.findOne(req.body);
            return res.send(findUser);
        } catch (err){
            res.status(500).send(err);
        }
    }