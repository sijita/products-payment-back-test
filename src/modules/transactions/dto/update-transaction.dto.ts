import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsNotEmpty()
  @IsUUID()
  transactionId: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['PENDING', 'COMPLETED', 'FAILED'])
  status: string;
}
