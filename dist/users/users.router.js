"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const users_model_1 = require("./users.model");
const model_router_1 = require("../common/model-router");
const auth_handler_1 = require("../security/auth.handler");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.findByEmail = (req, resp, next) => {
            if (req.query.email) {
                users_model_1.User.findByEmail(req.query.email)
                    .then((user) => (user ? [user] : []))
                    .then(this.renderAll(resp, next, {
                    pageSize: this.pageSize,
                    url: req.url,
                }))
                    .catch(next);
            }
            else {
                next();
            }
        };
        this.on("beforeRender", (document) => {
            document.password = undefined;
            //delete document.password
        });
    }
    applyRoutes(application) {
        application.get({ path: `${this.basePath}`, version: "2.0.0" }, [
            this.findByEmail,
            this.findAll,
        ]);
        // application.get({ path: "/users", version: "1.0.0" }, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, [this.save]);
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
        application.post(`${this.basePath}/authenticate`, auth_handler_1.authenticate);
        // application.get({ path: `${this.basePath}`, version: "2.0.0" }, [
        //   this.findByEmail,
        //   this.findAll,
        // ]);
        // application.get({ path: "/users", version: "1.0.0" }, this.findAll);
        // application.get(`${this.basePath}/:id`, [authorize("admin"), this.validateId, this.findById]);
        // application.post(`${this.basePath}`, [authorize("admin", "user"), this.save]);
        // application.put(`${this.basePath}/:id`, [authorize("admin", "user"), this.validateId, this.replace]);
        // application.patch(`${this.basePath}/:id`, [authorize("admin", "user"), this.validateId, this.update]);
        // application.del(`${this.basePath}/:id`, [authorize("admin", "user"), this.validateId, this.delete]);
        // application.post(`${this.basePath}/authenticate`, authenticate);
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
