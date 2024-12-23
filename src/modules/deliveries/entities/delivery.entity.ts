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

  @Column({ name: 'sub_address' })
  subAddress: string;

  @Column()
  country: string;

  @Column()
  region: string;

  @Column()
  city: string;

  @Column({ name: 'postal_code', nullable: true })
  postalCode?: string;

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
