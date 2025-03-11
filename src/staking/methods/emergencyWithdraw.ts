import { ethers } from 'ethers';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomJsonResponse } from '../../types/CustomJsonResponse';

export async function emergencyWithdraw(
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

        const tx = await stakingContract.emergencyWithdraw(stakingPool.blockchainPoolId);
        const receipt = await tx.wait();

        return {
            status: "success",
            message: 'Emergency withdrawal successful',
            data: { transactionHash: receipt.transactionHash },
        };
    } catch (error: any) {
        return {
            status: "failed",
            message: 'Error during emergency withdrawal',
            error: error.message,
        };
    }
}
