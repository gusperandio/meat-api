"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const fs = require("fs");
const restify = require("restify");
const mongoose = require("mongoose");
const environment_1 = require("../common/environment");
const merge_patch_parse_1 = require("./merge-patch.parse");
const error_handler_1 = require("./error.handler");
const token_parse_1 = require("../security/token.parse");
const logger_1 = require("../common/logger");
class Server {
    initializeDb() {
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment_1.environment.db.url, {});
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                const options = {
                    name: "meat-api",
                    version: "1.0.0",
                    log: logger_1.logger,
                };
                if (environment_1.environment.security.enableHTTPS) {
                    (options.certificate = fs.readFileSync(environment_1.environment.security.certificate)),
                        (options.key = fs.readFileSync(environment_1.environment.security.key));
                }
                this.application = restify.createServer(options);
                this.application.pre(restify.plugins.requestLogger({
                    log: logger_1.logger
                }));
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_patch_parse_1.mergePatchBodyParser);
                this.application.use(token_parse_1.tokenParser);
                //routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
                this.application.on("restifyError", error_handler_1.handleError);
                /*this.application.on('after', restify.plugins.auditLogger({
                  log: logger,
                  event: 'after',
                  server: this.application
                }))
        
                this.application.on('audit', data=>{
        
                })*/
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this));
    }
    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }
}
exports.Server = Server;
