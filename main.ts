import { reviewsRouter } from './reviews/reviews.router';
import { Server } from "./server/server";
import { usersRouter } from "./users/users.router";
import { restaurantRouter } from "./restaurants/restaurants.router";
const server = new Server();

server
  .bootstrap([usersRouter, restaurantRouter, reviewsRouter])
  .then((server) => {
    console.log("Server is listening on:", server.application.address());
  })
  .catch((error) => {
    console.log("Server failed to start");
    console.error(error);
    process.exit(1);
  });
