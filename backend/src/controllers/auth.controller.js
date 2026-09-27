import { AuthService } from "../services/auth.service.js";

export class AuthController {
  constructor() {
    this.authService = new AuthService();

    this.loginController = this.loginController.bind(this);
    this.registerController = this.registerController.bind(this);
    this.profileController = this.profileController.bind(this);
  }

  async loginController(req, res) {
    try {
      const { email, senha } = req.body;

      for (let [field, value] of Object.entries(req.body)) {
        if (!value) {
          return res.status(400).json({
            success: false,
            message: `O campo ${field} precisa está prenchido`,
          });
        }
      }

      const data = {
        email,
        senha,
      };

      const user = await this.authService.loginService(data);

      return res
        .status(200)
        .json({ success: true, message: "Logado com sucesso!", user });
    } catch (error) {
      console.error("Erro acontecido (auth controller):", error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Erro ao fazer login",
      });
    }
  }

  async registerController(req, res) {
    try {
      const { nome, email, matricula, tipo, senha } = req.body;

      for (let [field, value] of Object.entries(req.body)) {
        if (!value) {
          return res.status(400).json({
            success: false,
            message: `O campo ${field} precisa está prenchido`,
          });
        }
      }

      const data = {
        nome,
        email,
        matricula,
        tipo,
        senha,
      };
      const user = await this.authService.registerService(data);

      return res.status(201).json({
        success: true,
        message: "Usuário cadastrado com sucesso!",
        user,
      });
    } catch (error) {
      console.error("Erro acontecido (auth controller):", error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Erro ao fazer login",
      });
    }
  }

  async profileController(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId)
        return res
          .status(404)
          .json({ succerss: false, message: "Usuário não encontrado" });

      const user = await this.authService.profileService(userId);

      return res.status(200).json({
        success: true,
        message: "Seja bem vindo novamente!",
        user,
      });
    } catch (error) {
      console.error("Erro acontecido:", error);
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Erro ao entrar na conta",
      });
    }
  }
}
