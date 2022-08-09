import { Restaurant } from './restaurants/restaurants.model';
import * as jestCli from 'jest-cli'
import { Review } from './reviews/reviews.model';
import { reviewsRouter } from './reviews/reviews.router';
import { User } from "./users/users.model";
import { usersRouter } from "./users/users.router";
import { environment } from "./common/environment";
import { Server } from "./server/server";

let server: Server;
const beforeAllTest = () => {
  environment.db.url = process.env.DB_URL || "mongodb://localhost/meat-api-test-db";
  environment.server.port = process.env.SERVER_PORT || 3001;
  server = new Server();
  return server
    .bootstrap([usersRouter, reviewsRouter])
    .then(() => User.remove({}).exec())
    .then(()=>{
      let admin = new User()
      admin.name = 'admin'
      admin.email = 'gustavo.sperandio25@gmail.com'
      admin.password = '123456'
      admin.profiles = ['admin', 'user']
      return admin.save()
    })
    .then(() => Review.remove({}).exec())
    .then(() => Restaurant.remove({}).exec())
};

const afterAllTests = () => {
    return server.shutdown();

};

beforeAllTest()
  .then(()=>jestCli.run())
  .then(() => afterAllTests())
  .catch(console.error);
