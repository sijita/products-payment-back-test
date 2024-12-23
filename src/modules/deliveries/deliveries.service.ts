import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from './entities/delivery.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createDelivery({
    transactionId,
    country,
    region,
    city,
    address,
    subAddress,
    postalCode,
  }: CreateDeliveryDto): Promise<Delivery> {
    try {
      if (
        !transactionId ||
        !address ||
        !subAddress ||
        !country ||
        !region ||
        !city
      ) {
        throw new BadRequestException(
          'transactionId, address, subAddress, country, region, and city are required',
        );
      }

      const transaction = await this.transactionRepository.findOne({
        where: { id: transactionId },
      });

      if (!transaction) {
        throw new NotFoundException(
          `Transaction with id ${transactionId} not found`,
        );
      }

      if (transaction.delivery) {
        throw new BadRequestException(
          `Transaction already has an associated delivery`,
        );
      }

      const delivery = this.deliveryRepository.create({
        transaction,
        country,
        region,
        city,
        address,
        subAddress,
        postalCode,
        status: 'PENDING',
      });

      const savedDelivery = await this.deliveryRepository.save(delivery);

      this.eventEmitter.emit('delivery.created', savedDelivery);

      return savedDelivery;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while creating a delivery',
      );
    }
  }

  async updateDeliveryStatus(
    id: string,
    { status }: UpdateDeliveryDto,
  ): Promise<Delivery> {
    try {
      const delivery = await this.deliveryRepository.findOne({ where: { id } });

      if (!delivery) {
        throw new NotFoundException(`Delivery with id ${id} not found`);
      }

      delivery.status = status;
      await this.deliveryRepository.save(delivery);

      return delivery;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while updating the delivery status',
      );
    }
  }
}
