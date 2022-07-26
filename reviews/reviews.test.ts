import { environment } from "./../common/environment";
import { Server } from "../server/server";
import "jest";
import * as request from "supertest";

let address: string = (<any>global).address

test("get /reviews", () => {
    return request(address)
      .get("/reviews")
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.items).toBeInstanceOf(Array);
      })
      .catch();
  });