import { ethers } from 'ethers';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomJsonResponse } from '../../types/CustomJsonResponse';

export async function getPendingReward(
    stakingContract: ethers.Contract,
    prismaService: PrismaService,
    address: string,
    databasePoolId: number
): Promise<CustomJsonResponse> {
    try {
        const stakingPool = await prismaService.stakingPool.findUnique({
            where: { id: databasePoolId },
            select: { blockchainPoolId: true },
        });

        if (!stakingPool) {
            return {
                status: "failed",
                message: `Staking pool with ID ${databasePoolId} not found`,
                data: null,
            };
        }

        const reward = await stakingContract.getPendingReward(address, stakingPool.blockchainPoolId);

        return {
            status: "success",
            message: 'Pending reward retrieved successfully',
            data: { reward: reward.toString() },
        };
    } catch (error: any) {
        return {
            status: "failed",
            message: 'Error retrieving pending reward',
            error: error.message,
        };
    }
}
