"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelRouter = void 0;
const router_1 = require("./router");
const mongoose = require("mongoose");
const restify_errors_1 = require("restify-errors");
class ModelRouter extends router_1.Router {
    model;
    constructor(model) {
        super();
        this.model = model;
    }
    prepareOne(query) {
        return query;
    }
    validateId = (req, resp, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            next(new restify_errors_1.NotFoundError("Documento não encontrado"));
        }
        else {
            next();
        }
    };
    findAll = (req, resp, next) => {
        this.model.find().then(this.renderAll(resp, next)).catch(next);
    };
    findById = (req, resp, next) => {
        this.prepareOne(this.model.findById({ _id: req.params.id }))
            .then(this.render(resp, next))
            .catch(next);
    };
    save = (req, resp, next) => {
        let document = new this.model(req.body);
        document.save().then(this.render(resp, next)).catch(next);
    };
    replace = (req, resp, next) => {
        const options = { runValidators: true, overwrite: true };
        this.model
            .findByIdAndUpdate(req.params.id, req.body, options)
            .then((user) => {
            if (user) {
                resp.json(req.body);
                return next();
            }
            throw new restify_errors_1.NotFoundError("Documento não encontrado");
        })
            .catch(next);
    };
    update = (req, resp, next) => {
        const options = { runValidators: true, new: true };
        this.model
            .findByIdAndUpdate(req.params.id, req.body, options)
            .then(this.render(resp, next))
            .catch(next);
    };
    delete = (req, resp, next) => {
        this.model
            .remove({ _id: req.params.id })
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
    };
}
exports.ModelRouter = ModelRouter;
