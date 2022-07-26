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

  findByEmail = (req, resp, next) => {
    if (req.query.email) {
      User.findByEmail(req.query.email)
        .then(user => user ? [user] : [] )
        .then(this.renderAll(resp, next, {
            pageSize: this.pageSize,
            url: req.url
        }))
        .catch(next);
    } else {
      next();
    }
  };

  applyRoutes(application: restify.Server) {
    application.get({ path: `${this.basePath}`, version: "2.0.0" }, [
      this.findByEmail,
      this.findAll,
    ]);
    // application.get({ path: "/users", version: "1.0.0" }, this.findAll);
    application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
    application.post(`${this.basePath}`, this.save);
    application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
    application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
    application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);

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
