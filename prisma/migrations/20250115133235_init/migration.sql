-- CreateEnum
CREATE TYPE "PoolStatus" AS ENUM ('active', 'disabled', 'paused', 'closed', 'completed');

-- CreateEnum
CREATE TYPE "DepositStatus" AS ENUM ('pending', 'completed', 'failed');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "supabaseUserId" TEXT NOT NULL,
    "ethereumAddress" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StakingPool" (
    "id" SERIAL NOT NULL,
    "blockchainPoolId" INTEGER,
    "rewardRate" INTEGER NOT NULL,
    "totalStakedAmount" BIGINT NOT NULL DEFAULT 0,
    "totalRewardsPaid" BIGINT NOT NULL DEFAULT 0,
    "poolStatus" "PoolStatus" NOT NULL DEFAULT 'disabled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StakingPool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoolDeposit" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "stakingPoolId" INTEGER NOT NULL,
    "amountStaked" BIGINT NOT NULL,
    "transactionHash" TEXT DEFAULT '',
    "status" "DepositStatus" NOT NULL DEFAULT 'pending',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PoolDeposit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StakingPool_blockchainPoolId_key" ON "StakingPool"("blockchainPoolId");

-- CreateIndex
CREATE UNIQUE INDEX "PoolDeposit_transactionHash_key" ON "PoolDeposit"("transactionHash");

-- AddForeignKey
ALTER TABLE "PoolDeposit" ADD CONSTRAINT "PoolDeposit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoolDeposit" ADD CONSTRAINT "PoolDeposit_stakingPoolId_fkey" FOREIGN KEY ("stakingPoolId") REFERENCES "StakingPool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
