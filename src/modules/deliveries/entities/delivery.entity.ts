import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  address: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'IN_TRANSIT', 'DELIVERED'],
    default: 'PENDING',
  })
  status: string;

  @OneToOne(() => Transaction, (transaction) => transaction.delivery)
  @JoinColumn()
  transaction: Transaction;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
