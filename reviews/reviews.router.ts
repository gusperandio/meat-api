import * as restify from "restify";
import * as mongoose from "mongoose";
import { ModelRouter } from "../common/model-router";
import { Review } from "./review.model";

class ReviewsRouter extends ModelRouter<Review> {
  constructor() {
    super(Review);
  }

  protected prepareOne(
    query: mongoose.Query<Review, Review>
  ): mongoose.Query<Review, Review> {
    return query.populate("user", "name").populate("restaurant", "name");
  }

  /*findById = (req, resp, next) => {
    this.model
      .findById({ _id: req.params.id })
      .populate('user', 'name')
      .populate('restaurant', 'name')
      .then(this.render(resp, next))
      .catch(next);
  };*/

  applyRoutes(application: restify.Server) {
    application.get("/reviews", this.findAll);
    application.get("/reviews/:id", [this.validateId, this.findById]);
    application.post("/reviews", this.save);
  }
}

export const reviewsRouter = new ReviewsRouter();
