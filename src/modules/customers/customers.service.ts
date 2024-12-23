import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createUser({ email, name }: CreateCustomerDto): Promise<Customer> {
    try {
      const customer = this.customerRepository.create({ name, email });

      await this.customerRepository.save(customer);

      this.eventEmitter.emit('customer.created', customer);

      return customer;
    } catch (error) {
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the customer',
      );
    }
  }
}
