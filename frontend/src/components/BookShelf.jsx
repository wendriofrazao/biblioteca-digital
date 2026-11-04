import React, { useState } from "react";
import "../styles/components/BookShelf.css";

// Mapeia dinamicamente todas as imagens PNG da pasta assets via Vite
const bookImages = import.meta.glob("../assets/*.png", {
  eager: true,
  import: "default",
});

// Normaliza o mapa para facilitar a busca pelo nome do livro
const imageMap = {};
for (const [path, url] of Object.entries(bookImages)) {
  const fileName = path.split("/").pop().replace(/\.png$/i, "");
  imageMap[fileName] = url;
  imageMap[fileName.toLowerCase()] = url;
}

function getBookImage(name) {
  if (!name) return null;
  return imageMap[name] || imageMap[name.toLowerCase()] || null;
}

export function BookShelf({ livros = [], ativo, onSelect }) {
  const [failedImages, setFailedImages] = useState({});

  const handleImageError = (nomeLivro) => {
    setFailedImages((prev) => ({ ...prev, [nomeLivro]: true }));
  };

  return (
    <div className="shelf">
      <div className="books-container">
        {livros.map((livro, i) => {
          const nomeLivro = livro.book || livro.title || "";
          const rawImage = getBookImage(nomeLivro);
          const imagemCapa = failedImages[nomeLivro] ? null : rawImage;

          return (
            <div
              key={nomeLivro || i}
              className={`book-wrapper ${ativo === i ? "selected" : ""} ${
                imagemCapa ? "has-cover" : ""
              }`}
            >
              {/* Elemento do Livro */}
              <button
                type="button"
                className={`book ${ativo === i ? "selected" : ""}`}
                style={{
                  "--c": livro.hexColor || "#35596b",
                  "--h":
                    livro.height === "alto"
                      ? i === 2
                        ? "212px"
                        : "222px"
                      : livro.height === "baixo"
                        ? "188px"
                        : "196px",
                  "--w":
                    livro.width === "largo"
                      ? i === 2
                        ? "56px"
                        : "58px"
                      : livro.width === "estreito"
                        ? "50px"
                        : "52px",
                }}
                onClick={() => onSelect?.(i)}
                aria-pressed={ativo === i}
                aria-label={`${nomeLivro}, ${livro.author}`}
                title={nomeLivro}
              >
                {!imagemCapa && (
                  <>
                    <span className="band t" />
                    <span className="band t2" />
                    <span className="band b2" />
                    <span className="band b" />

                    <span className="plate">
                      <span>{nomeLivro}</span>
                    </span>

                    <span className="mark" />
                  </>
                )}
              </button>

              {/* Imagem que cobre o livro completo (lombada + topo 3D + lateral 3D) */}
              {imagemCapa && (
                <img
                  src={imagemCapa}
                  alt={nomeLivro}
                  className="book-cover-overlay"
                  onError={() => handleImageError(nomeLivro)}
                />
              )}
            </div>
          );
        })}

        <div className="board" />
      </div>
    </div>
  );
}

export const BookshelfScene = BookShelf;

export default BookShelf;
