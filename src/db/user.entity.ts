import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  email: string;

  @Column('text')
  password: string;
}
