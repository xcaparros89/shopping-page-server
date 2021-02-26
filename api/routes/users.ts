import { Router} from "express";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);
  route.get("/", function (req, res, next) {
    res.send("respond with a resource");
  });
};
