var createError = require('http-errors');
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/shopping-server", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );

    const ExpressLoader = require("./loaders/Express");
    new ExpressLoader();
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });
