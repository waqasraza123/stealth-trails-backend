import { Controller, Post, Body } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CustomJsonResponse } from '../types/CustomJsonResponse';

@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post()
  async create(@Body() createDepositDto: CreateDepositDto): Promise<CustomJsonResponse> {
    return this.depositService.create(createDepositDto);
  }
}
