import * as mongoose from "mongoose";
import { validateCPF } from "../common/validators";
import * as bcrypt from "bcrypt";
import { environment } from "../common/environment";

export interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  cpf: string;
  gender: string;
  profiles: string[];
  matches(password: string): boolean;
  hasAny(...profiles: string[]): boolean;
  //hasAny('admin', 'user')
}

export interface UserModel extends mongoose.Model<User> {
  findByEmail(email: string, projection?: string): Promise<User>;
} //todo COLOCAR ? DEMONSTRA QUE É OPCIONAL

export interface UserModel extends mongoose.Model<User> {
  findByCpf(cpf: string, projection?: string): Promise<User>;
} 

//* SELECT = Se será exibido esse campo
//* REQUIRED = Se é obrigatório informar esse campo
//* MAXLENGTH = Quantidade máxima de caracteres
//* MINLENGTH = Quantidade mínima de caracteres
//* ENUM = Só aceita os valores que forem passados
//* MATCH = Expressão regular para validar o que foi recebido
//* VALIDATE = Posso criar uma função ou um objeto para verificar

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 80,
    minlength: 3,
  },
  email: {
    type: String,
    unique: true,
    match:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  gender: {
    type: String,
    required: false,
    enum: ["Male", "Female"],
  },
  cpf: {
    type: String,
    required: false,
    validate: {
      validator: validateCPF,
      message: "{PATH}: Invalid CPF ({VALUE})",
    },
  },
  profiles: {
    type: [String],
    required: false,
  },
});

userSchema.statics.findByEmail = function (email: string, projection: string) {
  return this.findOne({ email }, projection);
};

userSchema.methods.matches = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.hasAny = function (...profiles: string[]): boolean {
  return profiles.some((profile) => this.profiles.indexOf(profile) !== -1);
};

const hashPassword = (obj, next) => {
  //todo O segundo parametro SALTROUNDS é um numero inteiro, faz a criptografia pela quantidade passada, nesse exemplo, criptografa 10 vezes
  bcrypt
    .hash(obj.password, environment.security.saltRounds)
    .then((hash) => {
      obj.password = hash;
      next();
    })
    .catch(next);
};

const saveMiddleware = function (next) {
  const user: User = this;
  if (!user.isModified("password")) {
    next();
  } else {
    hashPassword(user, next);
  }
};

const updateMiddleware = function (next) {
  if (!this.getUpdate().password) {
    next();
  } else {
    hashPassword(this.getUpdate(), next);
  }
};

userSchema.pre("save", saveMiddleware);

userSchema.pre("findOneAndUpdate", updateMiddleware);

userSchema.pre("update", updateMiddleware);

export const User = mongoose.model<User, UserModel>("User", userSchema);
