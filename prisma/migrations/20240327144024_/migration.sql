/*
  Warnings:

  - You are about to drop the column `currencyFrom` on the `CurrencyRate` table. All the data in the column will be lost.
  - You are about to drop the column `currencyTo` on the `CurrencyRate` table. All the data in the column will be lost.
  - Added the required column `baseCurrency` to the `CurrencyRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currencyName` to the `CurrencyRate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CurrencyRate" DROP COLUMN "currencyFrom",
DROP COLUMN "currencyTo",
ADD COLUMN     "baseCurrency" TEXT NOT NULL,
ADD COLUMN     "currencyName" TEXT NOT NULL;
