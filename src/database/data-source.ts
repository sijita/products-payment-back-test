import { Product } from 'src/modules/products/entities/product.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import ProductSeeder from './seeds/product-seeder';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Delivery } from 'src/modules/deliveries/entities/delivery.entity';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  entities: [Product, Transaction, Customer, Delivery],
  seeds: [ProductSeeder],
  synchronize: true,
};

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    // Verifica si la tabla de productos está vacía
    const productRepository = AppDataSource.getRepository(Product);
    const productCount = await productRepository.count();

    if (productCount === 0) {
      console.log('Database is empty, running seeds...');
      await runSeeders(AppDataSource);
      console.log('Seeding completed!');
    } else {
      console.log('Database already has data, skipping seeds...');
    }
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
    throw error;
  }
};

export const AppDataSource = new DataSource(options);
