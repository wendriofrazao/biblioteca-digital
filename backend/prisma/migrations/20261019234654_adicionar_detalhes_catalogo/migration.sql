/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `categoria` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "livro" ADD COLUMN     "capa_url" VARCHAR(500),
ADD COLUMN     "edicao" VARCHAR(50),
ADD COLUMN     "idioma" VARCHAR(60),
ADD COLUMN     "localizacao" VARCHAR(100),
ADD COLUMN     "paginas" INTEGER,
ADD COLUMN     "sinopse" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "vezes_emprestado" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "quantidade" SET DEFAULT 0,
ALTER COLUMN "disponiveis" SET DEFAULT 0;

-- CreateIndex
CREATE INDEX "autor_nome_idx" ON "autor"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_nome_key" ON "categoria"("nome");

-- CreateIndex
CREATE INDEX "emprestimo_status_idx" ON "emprestimo"("status");

-- CreateIndex
CREATE INDEX "livro_titulo_idx" ON "livro"("titulo");

-- CreateIndex
CREATE INDEX "livro_autor_autor_id_idx" ON "livro_autor"("autor_id");
