import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { QueryRunner, Repository } from 'typeorm';
import { Product } from 'src/modules/products/entities/product.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createTransaction(
    { amount, productId, customerId }: CreateTransactionDto,
    queryRunner: QueryRunner,
  ): Promise<Transaction> {
    try {
      if (!amount || !productId) {
        throw new BadRequestException('Amount and productId are required');
      }

      const product = await queryRunner.manager.findOne(Product, {
        where: { id: productId },
      });

      if (!product)
        throw new NotFoundException(`Product with id ${productId} not found`);

      if (product.stock <= 0)
        throw new BadRequestException(
          `Product ${product.name || productId} is out of stock`,
        );

      const transaction = queryRunner.manager.create(Transaction, {
        transactionNumber: `TR-${uuidv4()}`,
        status: 'PENDING',
        amount,
        customer: { id: customerId },
      });

      await queryRunner.manager.save(transaction);

      this.eventEmitter.emit('transaction.created', transaction);

      return transaction;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while processing the transaction',
      );
    }
  }

  async updateTransactionStatus({
    transactionId,
    status,
  }: UpdateTransactionDto): Promise<Transaction> {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id: transactionId },
      });

      if (!transaction)
        throw new NotFoundException(
          `Transaction with id ${transactionId} not found`,
        );

      transaction.status = status;
      await this.transactionRepository.save(transaction);

      this.eventEmitter.emit('transaction.updated', transaction);

      return transaction;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while updating the transaction status',
      );
    }
  }
}
