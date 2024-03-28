/*
  Warnings:

  - A unique constraint covering the columns `[currencyName]` on the table `CurrencyRate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CurrencyRate_currencyName_key" ON "CurrencyRate"("currencyName");
