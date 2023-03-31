import { IsNumber, IsNotEmpty } from 'class-validator';
export class CreateSaleBodyDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
