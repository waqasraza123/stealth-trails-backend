import { ethers } from 'ethers';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomJsonResponse } from '../../types/CustomJsonResponse';

export async function createPool(
    stakingContract: ethers.Contract,
    prismaService: PrismaService,
    rewardRate: number
): Promise<CustomJsonResponse> {
    try {
        const stakingPool = await prismaService.stakingPool.create({
            data: {
                rewardRate,
                poolStatus: "paused",
            },
        });

        const tx = await stakingContract.createPool(rewardRate, stakingPool.id);
        const receipt = await tx.wait();

        return {
            status: "success",
            message: 'Pool created successfully',
            data: { transactionHash: receipt.transactionHash },
        };
    } catch (error: any) {
        return {
            status: "failed",
            message: 'Error creating pool',
            error: error.message,
        };
    }
}
