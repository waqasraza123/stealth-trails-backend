-- CreateEnum
CREATE TYPE "PoolStatus" AS ENUM ('active', 'disabled', 'paused', 'closed', 'completed');

-- CreateTable
CREATE TABLE "StakingPool" (
    "id" SERIAL NOT NULL,
    "blockchainPoolId" INTEGER NOT NULL,
    "rewardRate" INTEGER NOT NULL,
    "totalStakedAmount" BIGINT NOT NULL DEFAULT 0,
    "totalRewardsPaid" BIGINT NOT NULL DEFAULT 0,
    "poolStatus" "PoolStatus" NOT NULL DEFAULT 'disabled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StakingPool_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StakingPool_blockchainPoolId_key" ON "StakingPool"("blockchainPoolId");
