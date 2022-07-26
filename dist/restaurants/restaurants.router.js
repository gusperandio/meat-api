"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantRouter = void 0;
const restify_errors_1 = require("restify-errors");
const restaurants_model_1 = require("./restaurants.model");
const model_router_1 = require("../common/model-router");
class RestaurantsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_model_1.Restaurant);
    }
    envelope(document) {
        let resource = super.envelope(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;
    }
    findMenu = (req, resp, next) => {
        restaurants_model_1.Restaurant.findById(req.params.id, "+menu").then(rest => {
            if (!rest) {
                throw new restify_errors_1.NotFoundError('Restaurante não existe');
            }
            else {
                resp.json(rest.menu);
                return next();
            }
        }).catch(next);
    };
    replaceMenu = (req, resp, next) => {
        restaurants_model_1.Restaurant.findById(req.params.id).then(rest => {
            if (!rest) {
                throw new restify_errors_1.NotFoundError('Restaurante não existe');
            }
            else {
                rest.menu = req.body; //Array de MenuItem
                return rest.save();
            }
        }).then(rest => {
            resp.json(rest.menu);
            return next();
        }).catch(next);
    };
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
        application.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu]);
        application.put(`${this.basePath}/:id/menu`, [this.validateId, this.replaceMenu]);
    }
}
exports.restaurantRouter = new RestaurantsRouter();
