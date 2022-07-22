import * as restify from "restify";

import { User } from "./users.model";
import { Router } from "../common/router";
import { NotFoundError } from "restify-errors";

class UsersRouter extends Router {
  constructor() {
    super();
    this.on("beforeRender", (document) => {
      document.password = undefined;
      //delete document.password
    });
  }

  applyRoutes(application: restify.Server) {
    application.get("/users", (req, resp, next) => {
      User.find().then(this.render(resp, next)).catch(next);
    });

    application.get("/users/:id", (req, resp, next) => {
      User.findById({ _id: req.params.id })
        .then(this.render(resp, next))
        .catch(next);
    });

    application.post("/users", (req, resp, next) => {
      let user = new User(req.body);
      user.save().then(this.render(resp, next)).catch(next);
    });

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

    application.put("/users/:id", (req, resp, next) => {
      const options = { runValidators: true, overwrite: true};

      User.findByIdAndUpdate(req.params.id, req.body, options)
        .then((user) => {
          if (user) {
            resp.json(req.body);
            return next();
          }

          //throw new NotFoundError('Documento não encontrado')
        })
        .catch(next);
    });

    application.patch("/users/:id", (req, resp, next) => {
      const options = { runValidators: true, new: true };

      User.findByIdAndUpdate(req.params.id, req.body, options)
        .then(this.render(resp, next))
        .catch(next);
    });

    application.del("/users/:id", (req, resp, next) => {
      User.remove({ _id: req.params.id })
        .exec()
        .then((cmdResult: any) => {
          if (cmdResult) {
            resp.send(true);
            return next();
          } else {
            //throw new NotFoundError('Documento não encontrado')
          }
          return next();
        })
        .catch(next);
    });
  }
}

export const usersRouter = new UsersRouter();
