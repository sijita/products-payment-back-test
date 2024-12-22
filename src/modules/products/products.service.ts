import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAllProducts(skip = 0, take = 10): Promise<Product[]> {
    try {
      return await this.productRepository.find({
        skip,
        take,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving products');
    }
  }
}
