import { User } from "./users.model";
import { usersRouter } from "./users.router";
import { environment } from "./../common/environment";
import { Server } from "../server/server";
import "jest";
import * as request from "supertest";


const address: string = (<any>global).address
const auth: string = (<any>global).auth

test("get /users", () => {
  return request(address)
    .get("/users")
    .set('Authorization', auth)
    .then((response) => {
      expect(response.status).toBe(200);
      expect(response.body.items).toBeInstanceOf(Array);
    })
    .catch();
});

test("post /users", () => {
  return request(address)
    .post("/users")
    .set('Authorization', auth)
    .send({
      name: "usuario1",
      email: "usuario1@email.com",
      password: "123456",
      cpf: "48254626855",
    })
    .then((response) => {
      expect(response.status).toBe(200);
      expect(response.body._id).toBeDefined();
      expect(response.body.name).toBe("usuario1");
      expect(response.body.email).toBe("usuario1@email.com");
      expect(response.body.cpf).toBe("48254626855");
      expect(response.body.password).toBeUndefined();
    })
    .catch();
});

test("get /users/aaaa - notfound", () => {
  return request(address)
    .get("/users/aaaa")
    .set('Authorization', auth)
    .then((response) => {
      expect(response.status).toBe(404);
    })
    .catch();
});

// test("patch /users/:id", () => {
//   return request(address)
//     .post("/users")
//     .set('Authorization', auth)
//     .send({
//       name: "usuario2",
//       email: "usuario2@email.com",
//       password: "123456",
//     })
//     .then((response) =>
//       request(address).patch(`/users/${response.body._id}`).send({
//         name: "usuario2 - Patch",
//       })
//     )
//     .then((response) => {
//       expect(response.status).toBe(200);
//       expect(response.body._id).toBeDefined();
//       expect(response.body.name).toBe("usuario2 - Patch");
//       expect(response.body.email).toBe("usuario2@email.com");
//       expect(response.body.password).toBeUndefined();
//     })
//     .catch();
// });
