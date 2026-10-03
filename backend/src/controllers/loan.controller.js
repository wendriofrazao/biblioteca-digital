import { LoanService } from "../services/loan.service.js";

const loanService = new LoanService();

export class LoanController {
  async createLoan(req, res) {
    try {
      const { livroId, usuarioId, dataPrevista, observacao } = req.body;

      const loan = await loanService.createLoanService({
        livroId,
        usuarioId,
        dataPrevista,
        observacao,
      });

      return res.status(201).json({
        message: "Empréstimo realizado com sucesso",
        emprestimo: loan,
      });
    } catch (error) {
      console.error("Erro no controller de empréstimo:", error);

      if (error.message.includes("não encontrado")) {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (
        error.message.includes("disponíveis") ||
        error.message.includes("já possui um empréstimo")
      ) {
        return res.status(409).json({
          message: error.message,
        });
      }

      if (
        error.message.includes("obrigatório") ||
        error.message.includes("inválida") ||
        error.message.includes("posterior")
      ) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async getAllLoans(req, res) {
    try {
      const loans = await loanService.getAllLoansService();

      return res.status(200).json(loans);
    } catch (error) {
      console.error("Erro no controller de empréstimo:", error);

      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async getLoanById(req, res) {
    try {
      const { id } = req.params;

      const loan = await loanService.getLoanByIdService(Number(id));

      return res.status(200).json(loan);
    } catch (error) {
      console.error("Erro no controller de empréstimo:", error);

      if (error.message.includes("não encontrado")) {
        return res.status(404).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async returnBook(req, res) {
    try {
      const { id } = req.params;

      const loan = await loanService.returnBookService(Number(id));

      return res.status(200).json({
        message: "Livro devolvido com sucesso",
        emprestimo: loan,
      });
    } catch (error) {
      console.error("Erro no controller de devolução:", error);

      if (error.message.includes("não encontrado")) {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (error.message.includes("já foi devolvido")) {
        return res.status(409).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async deleteLoan(req, res) {
    try {
      const { id } = req.params;

      await loanService.deleteLoanService(Number(id));

      return res.status(200).json({
        message: "Empréstimo excluído com sucesso",
      });
    } catch (error) {
      console.error("Erro no controller de empréstimo:", error);

      if (error.message.includes("não encontrado")) {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (error.message.includes("empréstimo ativo")) {
        return res.status(409).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  }
}
