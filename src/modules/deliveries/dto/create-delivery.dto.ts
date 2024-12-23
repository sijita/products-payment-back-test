import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDeliveryDto {
  @IsNotEmpty()
  @IsUUID()
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
