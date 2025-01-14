import { Controller, Get, Param, NotFoundException, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { SupabaseAuthGuard } from '../supabase/supabase-auth.guard';
import { CustomJsonResponse } from '../types/CustomJsonResponse';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string, @Req() req: any): Promise<CustomJsonResponse> {
    const authenticatedUser = req.user;

    console.log(authenticatedUser);
    if (authenticatedUser.id !== id) {
      throw new UnauthorizedException('You are not authorized to access this user');
    }

    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      status: 'success',
      message: 'User retreived.',
      data: user,
    };
  }
}
