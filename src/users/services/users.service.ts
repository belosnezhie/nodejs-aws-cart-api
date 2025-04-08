import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { User } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users as UserEntity } from '../../db/user.entity';

@Injectable()
export class UsersService {
  private readonly users: Record<string, User>;
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async findOne(name: string): Promise<UserEntity> {
    return await this.userRepo.findOne({ where: { name } });
  }

  async createOne({
    name,
    password,
  }: Partial<UserEntity>): Promise<UserEntity> {
    const id = randomUUID();
    const newUser = { id, name, password };

    const createdUser = await this.userRepo.create(newUser);
    this.logger.log('createOne', createdUser);

    this.users[id] = createdUser;

    return createdUser;
  }
}
