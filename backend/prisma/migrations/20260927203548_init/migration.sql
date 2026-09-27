-- CreateTable
CREATE TABLE "categoria" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livro" (
    "id" SERIAL NOT NULL,
    "isbn" VARCHAR(20) NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "editora" VARCHAR(120),
    "ano_publicacao" SMALLINT,
    "quantidade" INTEGER NOT NULL,
    "disponiveis" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "livro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "autor" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "nacionalidade" VARCHAR(80),
    "nascimento" DATE,

    CONSTRAINT "autor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livro_autor" (
    "livro_id" INTEGER NOT NULL,
    "autor_id" INTEGER NOT NULL,

    CONSTRAINT "livro_autor_pkey" PRIMARY KEY ("livro_id","autor_id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "matricula" VARCHAR(30) NOT NULL,
    "tipo" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emprestimo" (
    "id" SERIAL NOT NULL,
    "livro_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "data_emprestimo" DATE NOT NULL,
    "data_prevista" DATE NOT NULL,
    "data_devolucao" DATE,
    "status" VARCHAR(30) NOT NULL,
    "observacao" TEXT,

    CONSTRAINT "emprestimo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "livro_isbn_key" ON "livro"("isbn");

-- CreateIndex
CREATE INDEX "livro_categoria_id_idx" ON "livro"("categoria_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_matricula_key" ON "usuario"("matricula");

-- CreateIndex
CREATE INDEX "emprestimo_livro_id_idx" ON "emprestimo"("livro_id");

-- CreateIndex
CREATE INDEX "emprestimo_usuario_id_idx" ON "emprestimo"("usuario_id");

-- AddForeignKey
ALTER TABLE "livro" ADD CONSTRAINT "livro_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livro_autor" ADD CONSTRAINT "livro_autor_livro_id_fkey" FOREIGN KEY ("livro_id") REFERENCES "livro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livro_autor" ADD CONSTRAINT "livro_autor_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "autor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emprestimo" ADD CONSTRAINT "emprestimo_livro_id_fkey" FOREIGN KEY ("livro_id") REFERENCES "livro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emprestimo" ADD CONSTRAINT "emprestimo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
