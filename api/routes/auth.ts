const authController = require("../controllers/authControllers");
import { Router } from "express";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);
  route.post("/signup", authController.register);
};
