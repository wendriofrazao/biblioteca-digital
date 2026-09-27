import { JwtService } from "./jwt.service.js";
import { AuthRepository } from "../repository/auth.repository.js";
import bcrypt from "bcrypt";
import { use } from "react";

export class AuthService {
  constructor() {
    this.auth = new AuthRepository();
    this.jwt = new JwtService();
  }

  async loginService(data) {
    try {
      const user = await this.auth.getByEmail(data.email);

      if (!user) throw new Error("Usuário não encontrado");

      const compare = await bcrypt.compare(data.senha, user.senha);

      if (!compare) throw new Error("Senha inválida");

      const payload = {
        id: user.id,
        name: user.nome,
        email: user.email,
        matricula: user.matricula,
        tipo: user.tipo
      };

      const token = this.jwt.createToken(payload);

      if (!token) throw new Error("Erro ao gerar token");

      const dataResponse = {
        name: user.nome,
        email: user.email,
        tipo: user.tipo,
        token: token,
      };

      return dataResponse;
    } catch (error) {
      throw new Error(`Erro ao fazer login (authService): ${error}`);
    }
  }

  async registerService(data) {
    try {
      const isExiste = await this.auth.getByEmail(data.email);
      if (isExiste) throw new Error("Usuário ja criado");

      const passwordHash = await bcrypt.hash(data.senha, 10);

      const userData = { ...data, senha: passwordHash };

      await this.auth.createUser(userData);
    } catch (error) {
      throw new Error(`Erro ao fazer registro (authService): ${error}`);
    }
  }

  async profileService(userId) {
    try {
      if (!userId && typeof userId !== "string") {
        throw new Error("Tipo do ID inválido");
      }
      const user = await this.auth.getUserById(userId);

      if (!user) throw new Error("Usuário não encontrado");

      return user;
    } catch (error) {
      throw new Error(`Erro ao entrar no perfil (authService): ${error}`);
    }
  }
}
