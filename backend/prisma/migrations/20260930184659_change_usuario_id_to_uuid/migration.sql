/*
  Warnings:

  - The primary key for the `usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "emprestimo" DROP CONSTRAINT "emprestimo_usuario_id_fkey";

-- AlterTable
ALTER TABLE "emprestimo" ALTER COLUMN "usuario_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "usuario" DROP CONSTRAINT "usuario_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "usuario_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "usuario_id_seq";

-- AddForeignKey
ALTER TABLE "emprestimo" ADD CONSTRAINT "emprestimo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
