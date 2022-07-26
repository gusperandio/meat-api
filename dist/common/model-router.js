"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelRouter = void 0;
const router_1 = require("./router");
const mongoose = require("mongoose");
const restify_errors_1 = require("restify-errors");
class ModelRouter extends router_1.Router {
    model;
    basePath;
    pageSize = 2;
    constructor(model) {
        super();
        this.model = model;
        this.basePath = `/${model.collection.name}`;
    }
    prepareOne(query) {
        return query;
    }
    envelope(document) {
        let resource = Object.assign({ _links: {} }, document.toJSON());
        resource._links.self = `${this.basePath}/${resource._id}`;
        return resource;
    }
    envelopeAll(documents, options = {}) {
        const resource = {
            _links: {
                self: `${options.url}`,
            },
            items: documents,
        };
        if (options.page && options.count && options.pageSize) {
            if (options.page > 1) {
                resource._links.previous = `${this.basePath}?_page=${options.page - 1}`;
            }
            const remaining = options.count - (options.page * options.pageSize);
            if (remaining > 0) {
                resource._links.next = `${this.basePath}?_page=${options.page + 1}`;
            }
        }
        return resource;
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
        let page = parseInt(req.query._page || 1);
        page = page > 0 ? page : 1;
        const skip = (page - 1) * this.pageSize;
        this.model
            .count({})
            .exec()
            .then((count) => this.model
            .find()
            .skip(skip)
            .limit(this.pageSize) //traz a quantidade de registros de forma limitada
            .then(this.renderAll(resp, next, { page, count, pageSize: this.pageSize, url: req.url })))
            .catch(next);
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
