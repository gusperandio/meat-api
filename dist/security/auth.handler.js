"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const restify_errors_1 = require("restify-errors");
const users_model_1 = require("../users/users.model");
const environment_1 = require("../common/environment");
const jwt = require("jsonwebtoken");
const authenticate = (req, resp, next) => {
    const { cpf, password } = req.body;
    users_model_1.User.findByCpf(cpf, "+password")
        .then((user) => {
        if (user && user.matches(password)) {
            //gerar o token
            const token = jwt.sign({ sub: user.cpf, iss: "meat-api" }, environment_1.environment.security.apiSecret);
            resp.json({ name: user.name, email: user.email, accessToken: token });
            return next(false); //Retorna false pois ja foi concluido todos processos
        }
        else {
            return next(new restify_errors_1.NotAuthorizedError("Good bye bro"));
        }
    })
        .catch(next);
};
exports.authenticate = authenticate;
