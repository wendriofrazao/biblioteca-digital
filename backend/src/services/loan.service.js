import { LoanRepository } from "../repository/loan.repository.js";

const loanRepository = new LoanRepository();

export class LoanService {
  async createLoanService(data) {
    const { livroId, usuarioId, dataPrevista, observacao } = data;

    if (!livroId) {
      throw new Error("O livro é obrigatório");
    }

    if (!usuarioId) {
      throw new Error("O usuário é obrigatório");
    }

    if (!dataPrevista) {
      throw new Error("A data prevista para devolução é obrigatória");
    }

    const usuario = await loanRepository.findUserRepository(usuarioId);

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    const livro = await loanRepository.findBookRepository(Number(livroId));

    if (!livro) {
      throw new Error("Livro não encontrado");
    }

    if (livro.disponiveis <= 0) {
      throw new Error("Não existem exemplares disponíveis para empréstimo");
    }

    const activeLoan =
      await loanRepository.getActiveLoanByUserAndBookRepository(
        usuarioId,
        Number(livroId),
      );

    if (activeLoan) {
      throw new Error("Este usuário já possui um empréstimo ativo deste livro");
    }

    const dataEmprestimo = new Date();

    const dataPrevistaDate = new Date(dataPrevista);

    if (Number.isNaN(dataPrevistaDate.getTime())) {
      throw new Error("A data prevista é inválida");
    }

    if (dataPrevistaDate <= dataEmprestimo) {
      throw new Error(
        "A data prevista deve ser posterior à data do empréstimo",
      );
    }

    const loan = await loanRepository.createLoanRepository({
      livroId: Number(livroId),
      usuarioId,
      dataEmprestimo,
      dataPrevista: dataPrevistaDate,
      status: "ATIVO",
      observacao: observacao?.trim() || null,
    });

    await loanRepository.decreaseAvailableBooksRepository(Number(livroId));

    return loan;
  }

  async getAllLoansService() {
    return await loanRepository.getAllLoansRepository();
  }

  async getLoanByIdService(id) {
    const loan = await loanRepository.getLoanByIdRepository(id);

    if (!loan) {
      throw new Error("Empréstimo não encontrado");
    }

    return loan;
  }

  async returnBookService(id) {
    const loan = await loanRepository.getLoanByIdRepository(id);

    if (!loan) {
      throw new Error("Empréstimo não encontrado");
    }

    if (loan.dataDevolucao) {
      throw new Error("Este livro já foi devolvido");
    }

    const dataDevolucao = new Date();

    const updatedLoan = await loanRepository.updateLoanRepository(id, {
      dataDevolucao,
      status: "DEVOLVIDO",
    });

    await loanRepository.increaseAvailableBooksRepository(loan.livroId);

    return updatedLoan;
  }

  async deleteLoanService(id) {
    const loan = await loanRepository.getLoanByIdRepository(id);

    if (!loan) {
      throw new Error("Empréstimo não encontrado");
    }

    if (!loan.dataDevolucao) {
      throw new Error("Não é possível excluir um empréstimo ativo");
    }

    return await loanRepository.deleteLoanRepository(id);
  }
}
