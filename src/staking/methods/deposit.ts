import { ethers } from 'ethers';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../../auth/auth.service';
import { CustomJsonResponse } from '../../types/CustomJsonResponse';

export async function deposit(
    stakingContract: ethers.Contract,
    prismaService: PrismaService,
    authService: AuthService,
    poolId: number,
    amount: string,
    supabaseUserId: string
): Promise<CustomJsonResponse> {
    try {
        const convertedAmount = ethers.utils.parseUnits(amount, 18);
        const user = await authService.getUserFromDatabaseById(supabaseUserId);

        const stakingPool = await prismaService.stakingPool.findUnique({
            where: { id: poolId },
            select: { blockchainPoolId: true },
        });

        if (!stakingPool) {
            return {
                status: 'failed',
                message: `Staking pool with ID ${poolId} not found`,
                data: null,
            };
        }

        const blockchainPoolId = stakingPool.blockchainPoolId;

        const tx = await stakingContract.deposit(blockchainPoolId, convertedAmount);
        const receipt = await tx.wait();

        return {
            status: 'success',
            message: 'Deposit successful',
            data: { transactionHash: receipt.transactionHash },
        };
    } catch (error: any) {
        return {
            status: 'failed',
            message: 'Error during deposit',
            error: error.message,
        };
    }
}
