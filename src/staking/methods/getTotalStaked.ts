import { ethers } from 'ethers';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomJsonResponse } from '../../types/CustomJsonResponse';

export async function getTotalStaked(
    stakingContract: ethers.Contract,
    prismaService: PrismaService,
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

        const totalStaked = await stakingContract.getTotalStaked(stakingPool.blockchainPoolId);

        return {
            status: "success",
            message: 'Total staked amount retrieved successfully',
            data: { totalStaked: totalStaked.toString() },
        };
    } catch (error: any) {
        return {
            status: "failed",
            message: 'Error retrieving total staked amount',
            error: error.message,
        };
    }
}
