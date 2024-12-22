import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { Product } from 'src/modules/products/entities/product.entity';

export default class ProductSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const productRepository = dataSource.getRepository(Product);

    const products = [];
    for (let i = 0; i < 25; i++) {
      const product = new Product();
      product.name = faker.commerce.productName();
      product.description = faker.commerce.productDescription();
      const basePrice = faker.number.int({ min: 10, max: 1000 }) * 1000;
      product.price = basePrice;
      product.stock = faker.number.int({ min: 0, max: 100 });

      products.push(product);
    }

    await productRepository.save(products);
  }
}
