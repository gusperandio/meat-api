"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const users_model_1 = require("./users.model");
const router_1 = require("../common/router");
class UsersRouter extends router_1.Router {
    constructor() {
        super();
        this.on("beforeRender", (document) => {
            document.password = undefined;
            //delete document.password
        });
    }
    applyRoutes(application) {
        application.get("/users", (req, resp, next) => {
            users_model_1.User.find().then(this.render(resp, next)).catch(next);
        });
        application.get("/users/:id", (req, resp, next) => {
            users_model_1.User.findById({ _id: req.params.id })
                .then(this.render(resp, next))
                .catch(next);
        });
        application.post("/users", (req, resp, next) => {
            let user = new users_model_1.User(req.body);
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
            const options = { runValidators: true, overwrite: true };
            users_model_1.User.findByIdAndUpdate(req.params.id, req.body, options)
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
            users_model_1.User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next);
        });
        application.del("/users/:id", (req, resp, next) => {
            users_model_1.User.remove({ _id: req.params.id })
                .exec()
                .then((cmdResult) => {
                if (cmdResult) {
                    resp.send(true);
                    return next();
                }
                else {
                    //throw new NotFoundError('Documento não encontrado')
                }
                return next();
            })
                .catch(next);
        });
    }
}
exports.usersRouter = new UsersRouter();
