"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restaurants_model_1 = require("./restaurants/restaurants.model");
const jestCli = require("jest-cli");
const reviews_model_1 = require("./reviews/reviews.model");
const reviews_router_1 = require("./reviews/reviews.router");
const users_model_1 = require("./users/users.model");
const users_router_1 = require("./users/users.router");
const environment_1 = require("./common/environment");
const server_1 = require("./server/server");
let server;
const beforeAllTest = () => {
    environment_1.environment.db.url = process.env.DB_URL || "mongodb://localhost/meat-api-test-db";
    environment_1.environment.server.port = process.env.SERVER_PORT || 3001;
    server = new server_1.Server();
    return server
        .bootstrap([users_router_1.usersRouter, reviews_router_1.reviewsRouter])
        .then(() => users_model_1.User.remove({}).exec())
        .then(() => {
        let admin = new users_model_1.User();
        admin.name = 'admin';
        admin.email = 'gustavo.sperandio25@gmail.com';
        admin.password = '123456';
        admin.profiles = ['admin', 'user'];
        return admin.save();
    })
        .then(() => reviews_model_1.Review.remove({}).exec())
        .then(() => restaurants_model_1.Restaurant.remove({}).exec());
};
const afterAllTests = () => {
    return server.shutdown();
};
beforeAllTest()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error);
