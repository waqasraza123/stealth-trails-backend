-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('pending', 'completed', 'failed');

-- CreateTable
CREATE TABLE "PoolWithdrawal" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "stakingPoolId" INTEGER NOT NULL,
    "amountWithdrawn" BIGINT NOT NULL,
    "transactionHash" TEXT DEFAULT '',
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'pending',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PoolWithdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PoolWithdrawal_transactionHash_key" ON "PoolWithdrawal"("transactionHash");

-- AddForeignKey
ALTER TABLE "PoolWithdrawal" ADD CONSTRAINT "PoolWithdrawal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoolWithdrawal" ADD CONSTRAINT "PoolWithdrawal_stakingPoolId_fkey" FOREIGN KEY ("stakingPoolId") REFERENCES "StakingPool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
