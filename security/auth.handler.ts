import * as restify from "restify";
import { NotAuthorizedError } from "restify-errors";
import { User } from "../users/users.model";
import { environment } from "../common/environment";
import * as jwt from "jsonwebtoken";

export const authenticate: restify.RequestHandler = (req, resp, next) => {
  const { cpf, password } = req.body;
  
  User.findByCpf(cpf, "+password")
    .then((user) => {
      if (user && user.matches(password)) {
        //gerar o token

        const token = jwt.sign(
          { sub: user.cpf, iss: "meat-api" },
          environment.security.apiSecret
        );

        resp.json({ name: user.name, email: user.email, accessToken: token });
        return next(false); //Retorna false pois ja foi concluido todos processos
      } else {
        return next(new NotAuthorizedError("Good bye bro"));
      }
    })
    .catch(next);
};
