import * as restify from "restify";
import { User } from "./users.model";
import { ModelRouter } from "../common/model-router";

class UsersRouter extends ModelRouter<User> {
  constructor() {
    super(User);
    this.on("beforeRender", (document) => {
      document.password = undefined;
      //delete document.password
    });
  }

  applyRoutes(application: restify.Server) {
    application.get("/users", this.findAll);
    application.get("/users/:id", [this.validateId, this.findById]);
    application.post("/users", this.save);
    application.put("/users/:id", [this.validateId, this.replace]);
    application.patch("/users/:id", [this.validateId, this.update]);
    application.del("/users/:id", [this.validateId, this.delete]);

    //! metodo sem o reuso de rotas
    // application.get("/users", (req, resp, next) => {
    //   User.find().then((users) => {
    //     resp.json(users);
    //     return next();
    //   });
    // });

    // application.get("/users/:id", (req, resp, next) => {
    //   User.findById({ _id: req.params.id }).then((user) => {
    //     if (user) {
    //       resp.json(user);
    //       return next();
    //     }

    //     resp.send(404);
    //     return next();
    //   });
    // });

    // application.post("/users", (req, resp, next) => {
    //   let user = new User(req.body);
    //   user.save().then((user) => {
    //     user.password = undefined;

    //     resp.json(user);
    //     return next();
    //   });
    // });
  }
}

export const usersRouter = new UsersRouter();
