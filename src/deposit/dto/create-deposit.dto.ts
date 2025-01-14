import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateDepositDto {
  @IsString()
  @IsNotEmpty()
  asset: string = "";

  @IsNumber()
  @Min(0)
  amount: number = 0;

  @IsString()
  @IsNotEmpty()
  address: string = "";
}
