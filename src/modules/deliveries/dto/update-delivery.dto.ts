import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliveryDto } from './create-delivery.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateDeliveryDto extends PartialType(CreateDeliveryDto) {
  @IsEnum(['PENDING', 'IN_TRANSIT', 'DELIVERED'])
  @IsNotEmpty()
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED';
}
