import { JwtService } from "./jwt.service.js";
import { AuthRepository } from "../repository/auth.repository.js";
import bcrypt from "bcrypt";

export class AuthService {
  constructor() {
    this.auth = new AuthRepository();
    this.jwt = new JwtService();
  }

  async loginService(data) {
    const user = await this.auth.getByEmail(data.email);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const senhaValida = await bcrypt.compare(data.senha, user.senha);

    if (!senhaValida) {
      throw new Error("Senha inválida.");
    }

    const payload = {
      id: user.id,
      name: user.nome,
      email: user.email,
      matricula: user.matricula,
      tipo: user.tipo,
    };

    const token = this.jwt.createToken(payload);

    if (!token) {
      throw new Error("Erro ao gerar token.");
    }

    return {
      name: user.nome,
      email: user.email,
      matricula: user.matricula,
      tipo: user.tipo,
      token,
    };
  }

  async registerService(data) {
    const existente = await this.auth.getByEmail(data.email);

    if (existente) {
      throw new Error("Já existe um usuário com esse e-mail.");
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const userData = {
      ...data,
      senha: senhaHash,
    };

    const usuarioCriado = await this.auth.createUser(userData);

    if (usuarioCriado) {
      const { senha, ...usuarioSeguro } = usuarioCriado;
      return usuarioSeguro;
    }

    return {
      nome: data.nome,
      email: data.email,
      matricula: data.matricula,
      tipo: data.tipo,
    };
  }

  async profileService(userId) {
    if (!userId || typeof userId !== "string") {
      throw new Error("ID do usuário inválido.");
    }

    const user = await this.auth.getUserById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const { senha, ...usuarioSeguro } = user;

    return usuarioSeguro;
  }
}
