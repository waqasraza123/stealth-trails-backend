import { ethers } from 'ethers';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomJsonResponse } from '../../types/CustomJsonResponse';

export async function getStakedBalance(
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

        const balance = await stakingContract.getStakedBalance(address, stakingPool.blockchainPoolId);

        return {
            status: "success",
            message: 'Staked balance retrieved successfully',
            data: { balance: balance.toString() },
        };
    } catch (error: any) {
        return {
            status: "failed",
            message: 'Error retrieving staked balance',
            error: error.message,
        };
    }
}
