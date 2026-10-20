import { useState } from "react";
import {
  Clock,
  RotateCw,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  BookOpen,
  ArrowRight,
} from "lucide-react";

import "../styles/components/LoansView.css";

export function LoansView({
  loans = [],
  onRenewLoan,
  onReturnLoan,
  user,
  onExploreCatalog,
}) {
  const [activeTab, setActiveTab] = useState("ativos");
  const [receiptLoan, setReceiptLoan] = useState(null);

  const activeLoans = loans.filter((loan) => loan.status !== "devolvido");
  const returnedLoans = loans.filter((loan) => loan.status === "devolvido");

  const maxLoans = Number(user?.maxLoans) || 0;
  const quotaPercentage =
    maxLoans > 0
      ? Math.min(100, Math.round((activeLoans.length / maxLoans) * 100))
      : 0;

  const formatReceiptId = (id) =>
    String(id ?? "").toUpperCase();

  return (
    <main className="loans-view">
      <section className="loans-banner">
        <div className="loans-banner-top">
          <div className="loans-heading">
            <div className="loans-eyebrow">
              <ShieldCheck size={16} />
              <span>
                Controle de Circulação · {user?.name || "Usuário"}
                {user?.code ? ` (${user.code})` : ""}
              </span>
            </div>

            <h1 className="loans-title">Meus Empréstimos</h1>

            <p className="loans-subtitle">
              14 dias de prazo para cada título · Renove até 3 vezes online
              sem burocracia.
            </p>
          </div>

          <div className="loans-quota">
            <div className="loans-quota-info">
              <span className="loans-quota-label">
                Cota de Empréstimos
              </span>

              <p className="loans-quota-value">
                {activeLoans.length}
                <span>
                  {" "}de {maxLoans} livros
                </span>
              </p>
            </div>

            <div
              className="loans-quota-circle"
              role="img"
              aria-label={`${quotaPercentage}% da cota utilizada`}
              style={{ "--quota-progress": `${quotaPercentage}%` }}
            >
              <span>{quotaPercentage}%</span>
            </div>
          </div>
        </div>

        <div className="loans-tabs" role="tablist" aria-label="Empréstimos">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "ativos"}
            className={`loans-tab ${
              activeTab === "ativos" ? "active" : ""
            }`}
            onClick={() => setActiveTab("ativos")}
          >
            Empréstimos Ativos ({activeLoans.length})
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "historico"}
            className={`loans-tab ${
              activeTab === "historico" ? "active" : ""
            }`}
            onClick={() => setActiveTab("historico")}
          >
            Histórico de Devoluções ({returnedLoans.length})
          </button>
        </div>
      </section>

      {activeTab === "ativos" ? (
        activeLoans.length === 0 ? (
          <section className="loans-empty">
            <BookOpen className="loans-empty-icon" size={46} />

            <h2>Nenhum empréstimo ativo no momento</h2>

            <p>
              Você não possui nenhum livro retirado no momento. Navegue pelo
              catálogo do acervo e escolha suas próximas leituras.
            </p>

            <button
              type="button"
              className="loans-explore-button"
              onClick={onExploreCatalog}
            >
              Explorar Catálogo
              <ArrowRight size={15} />
            </button>
          </section>
        ) : (
          <section className="loans-list" aria-label="Empréstimos ativos">
            {activeLoans.map((loan) => {
              const renewalLimitReached =
                loan.renewalCount >= loan.maxRenewals;

              return (
                <article className="loan-card" key={loan.id}>
                  <div className="loan-book-info">
                    <div className="loan-cover">
                      {loan.coverUrl ? (
                        <img
                          src={loan.coverUrl}
                          alt={`Capa de ${loan.bookTitle}`}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <BookOpen size={30} />
                      )}
                    </div>

                    <div className="loan-book-details">
                      <span className="loan-code">{loan.code}</span>

                      <h2>{loan.bookTitle}</h2>

                      <p className="loan-author">{loan.author}</p>

                      <div className="loan-metadata">
                        <div className="loan-date">
                          <Calendar size={14} />
                          <span>Retirada: {loan.loanDate}</span>
                        </div>

                        <div className="loan-due-date">
                          <Clock size={14} />
                          <span>Devolução: {loan.dueDate}</span>
                        </div>

                        <span className="loan-renewal-info">
                          Renovações: {loan.renewalCount} de{" "}
                          {loan.maxRenewals}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="loan-controls">
                    <button
                      type="button"
                      onClick={() => onRenewLoan(loan.id)}
                      disabled={renewalLimitReached}
                      className="loan-action-button loan-renew-button"
                    >
                      <RotateCw size={14} />
                      <span>
                        {renewalLimitReached
                          ? "Limite atingido"
                          : "Renovar +14 dias"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onReturnLoan(loan.id)}
                      className="loan-action-button loan-return-button"
                    >
                      <CheckCircle2 size={14} />
                      <span>Devolver Livro</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReceiptLoan(loan)}
                      className="loan-receipt-button"
                    >
                      Ver Comprovante Digital
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )
      ) : (
        <section className="loans-history">
          {returnedLoans.length === 0 ? (
            <p className="loans-history-empty">
              Ainda não há registros de devoluções no histórico deste usuário.
            </p>
          ) : (
            <div className="loans-history-list">
              {returnedLoans.map((loan) => (
                <article className="loan-history-item" key={loan.id}>
                  <div className="loan-history-book">
                    <h2>{loan.bookTitle}</h2>
                    <p>
                      {loan.author} · {loan.code}
                    </p>
                  </div>

                  <div className="loan-history-status">
                    <span className="loan-returned-badge">
                      <CheckCircle2 size={14} />
                      Devolvido
                    </span>

                    <span className="loan-history-caption">
                      Devolução registrada
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {receiptLoan && (
        <div
          className="receipt-overlay"
          onClick={() => setReceiptLoan(null)}
        >
          <section
            className="receipt-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="receipt-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="receipt-header">
              <span className="receipt-logo-dot" />

              <h2 id="receipt-title">
                Biblioteca RB — Comprovante de Empréstimo
              </h2>

              <p>
                AUTENTICAÇÃO: RB-{formatReceiptId(receiptLoan.id)}-2026
              </p>
            </div>

            <div className="receipt-details">
              <div className="receipt-row">
                <span>Usuário:</span>
                <strong>
                  {user?.name || "Usuário"}
                  {user?.code ? ` (${user.code})` : ""}
                </strong>
              </div>

              <div className="receipt-row">
                <span>Título:</span>
                <strong>{receiptLoan.bookTitle}</strong>
              </div>

              <div className="receipt-row">
                <span>Autor:</span>
                <strong>{receiptLoan.author}</strong>
              </div>

              <div className="receipt-row">
                <span>Data de Empréstimo:</span>
                <strong>{receiptLoan.loanDate}</strong>
              </div>

              <div className="receipt-row">
                <span>Data Limite de Devolução:</span>
                <strong className="receipt-due-date">
                  {receiptLoan.dueDate}
                </strong>
              </div>

              <div className="receipt-row">
                <span>Renovações Efetuadas:</span>
                <strong>
                  {receiptLoan.renewalCount} de {receiptLoan.maxRenewals}
                </strong>
              </div>
            </div>

            <div className="receipt-footer">
              <button
                type="button"
                onClick={() => setReceiptLoan(null)}
                className="receipt-close-button"
              >
                Fechar
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
