"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const users_model_1 = require("./users.model");
const model_router_1 = require("../common/model-router");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.on("beforeRender", (document) => {
            document.password = undefined;
            //delete document.password
        });
    }
    applyRoutes(application) {
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
exports.usersRouter = new UsersRouter();
