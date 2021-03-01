
const bcrypt = require("bcrypt");
const saltRounds = 10;
const Login = require('../services/Login');
const LoginInstance = new Login();

    exports.login = async (req, res, next) => {
        try{
            const findUser = await LoginInstance.findOne(req.body);
            console.log(findUser);
            return res.send(findUser);
        } catch (err){
            res.status(500).send(err);
        }
    }