import { environment } from "./environment";
import * as bunyan from "bunyan";
environment;
export const logger = bunyan.createLogger({
  name: environment.log.name,
  level: (<any>bunyan).resolveLevel(environment.log.level),
});
