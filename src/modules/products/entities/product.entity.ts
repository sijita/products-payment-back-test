import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'integer' })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @OneToMany(() => Transaction, (transaction) => transaction.product)
  transactions: Transaction[];
}
