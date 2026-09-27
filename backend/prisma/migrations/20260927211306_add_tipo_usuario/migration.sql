/*
  Warnings:

  - The `tipo` column on the `usuario` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TipoUsuario" NOT NULL DEFAULT 'USER';
