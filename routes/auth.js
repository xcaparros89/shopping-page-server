const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/user");


router.post(
    "/signup",
    // revisamos si el user no está ya logueado usando la función helper (chequeamos si existe req.session.currentUser)
    //isNotLoggedIn(),
    // revisa que se hayan completado los valores de username y password usando la función helper
    //validationLoggin(),
    async (req, res, next) => {
      const { username, email, password } = req.body;
  
      try {
        if(password.length<5){res.status(400).json({errorMessage:'Password must have at least 5 characters and no spaces!'});}
        else{
          const usernameExists = await User.findOne({ username }, "username");
          if (usernameExists){res.status(400).json({errorMessage:'Username already exists!'});}
          else {
            // en caso contratio, si el usuario no existe, hace hash del password y crea un nuevo usuario en la BD
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashPass = bcrypt.hashSync(password, salt);
            const newUser = await User.create({ username, email, password: hashPass });
            // luego asignamos el nuevo documento user a req.session.currentUser y luego enviamos la respuesta en json
            //req.session.currentUser = newUser;
            console.log(newUser);
            res
            .status(200) //  OK
            .json({errorMessage:false, user:newUser});
          }
        }
      } catch (error) {
        next(error);
      }
    }
  );

module.exports = router;