import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  address: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'IN_TRANSIT', 'DELIVERED'],
    default: 'PENDING',
  })
  status: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.delivery, {
    eager: true,
  })
  transaction: Transaction;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
