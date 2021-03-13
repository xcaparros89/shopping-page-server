var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
var authRouter = require('../routes/auth');
var itemRouter = require('../routes/item');
var categoryRouter = require('../routes/category');


const hbs = require("hbs");
class ExpressLoader {
  constructor() {
    var app = express();
    // view engine setup
    // it will change to handlebars probably
    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "jade");

    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));

    //app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

    // app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({ extended: false }));

    // ADD CORS SETTINGS HERE TO ALLOW CROSS-ORIGIN INTERACTION:

    app.use(
      cors({
        credentials: true,
        origin: ["http://localhost:3000"], // <== this will be the URL of our React app (it will be running on port 3000)
      })
    );
    
    app.use("/auth", authRouter);
    app.use("/item", itemRouter);
    app.use("/category", categoryRouter);

    // Start application
    this.server = app.listen(4000, () => {
      console.log(`Express running, now listening on port 4000`);
    });
  }
  get Server() {
    return this.server;
  }

  /**
   * @description Default error handler to be used with express
   * @param error Error object
   * @param req {object} Express req object
   * @param res {object} Express res object
   * @param next {function} Express next object
   * @returns {*}
   */
  static errorHandler(error, req, res, next) {
    let parsedError;

    // Attempt to gracefully parse error object
    try {
      if (error && typeof error === "object") {
        parsedError = JSON.stringify(error);
      } else {
        parsedError = error;
      }
    } catch (e) {
      logger.error(e);
    }

    // Log the original error
    logger.error(parsedError);

    // If response is already sent, don't attempt to respond to client
    if (res.headersSent) {
      return next(error);
    }

    res.status(400).json({
      success: false,
      error,
    });
  }
}

module.exports = ExpressLoader;