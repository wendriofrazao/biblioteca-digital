import { useState } from "react";
import { CatalogView } from "../components/CatalogView.jsx";
import { BookDetailModal } from "../components/BookDetailModal.jsx";

export function Catalogo() {
  const [livroSelecionado, setLivroSelecionado] = useState(null);

  function handleBorrow(book) {
    console.log("Solicitar empréstimo:", book.id);

    // Conecte aqui o serviço de empréstimos da sua API.
  }

  function handleReserve(book) {
    console.log("Solicitar reserva:", book.id);

    // Conecte aqui o serviço de reservas da sua API.
  }

  return (
    <div className="biblioteca-layout">
      <CatalogView
        onSelectBook={setLivroSelecionado}
        onBorrowBook={handleBorrow}
        onReserveBook={handleReserve}
      />

      <BookDetailModal
        book={livroSelecionado}
        onClose={() => setLivroSelecionado(null)}
        onBorrow={handleBorrow}
        onReserve={handleReserve}
      />
    </div>
  );
}
