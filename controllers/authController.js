const Auth = require('../services/User');
const AuthInstance = new Auth();

    exports.register = async (req, res, next) => {
        try{
            console.log('authControllers')
            const createdUser = await AuthInstance.register(req.body);
            return res.send(createdUser);
        } catch (err){
            res.status(500).send(err);
        }
    }

    exports.login = async (req, res, next) => {
        try{
            const findUser = await AuthInstance.login(req.body);
            console.log(findUser);
            return res.send(findUser);
        } catch (err){
            res.status(500).send(err);
        }
    }