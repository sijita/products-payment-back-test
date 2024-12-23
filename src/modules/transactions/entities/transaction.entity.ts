import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Delivery } from 'src/modules/deliveries/entities/delivery.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  transactionNumber: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING',
  })
  status: string;

  @Column('numeric', { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Product, (product) => product.transactions, { eager: true })
  product: Product;

  @ManyToOne(() => Customer, (customer) => customer.transactions, {
    eager: true,
  })
  customer: Customer;

  @OneToOne(() => Delivery, (delivery) => delivery.transaction, { eager: true })
  delivery: Delivery;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
