import path from "path";
import cookieParser from "cookie-parser";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../api/routes';
import config from '../config';
export default ({ app }: { app: express.Application }) => {
    var app = express();
    // view engine setup
    // it will change to handlebars probably
    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "jade");
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));

    //app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // ADD CORS SETTINGS HERE TO ALLOW CROSS-ORIGIN INTERACTION:

    app.use(
      cors({
        credentials: true,
        origin: ["http://localhost:3000"], // <== this will be the URL of our React app (it will be running on port 3000)
      })
    );

    app.use(config.api.prefix, routes());

    /// catch 404 and forward to error handler
    app.use((req, res, next) => {
      const err = new Error('Not Found');
      err['status'] = 404;
      next(err);
    });
  
    /// error handlers
    app.use((err, req, res, next) => {
      /**
       * Handle 401 thrown by express-jwt library
       */
      if (err.name === 'UnauthorizedError') {
        return res
          .status(err.status)
          .send({ message: err.message })
          .end();
      }
      return next(err);
    });
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.json({
        errors: {
          message: err.message,
        },
      });
    });

  }