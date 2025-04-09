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
    email,
  }: Partial<UserEntity>): Promise<UserEntity> {
    const id = randomUUID();
    const newUser: UserEntity = {
      id: id,
      name: name,
      email: email,
      password: password,
    };
    this.logger.log('createOne: new user', newUser);
    const createdUser = await this.userRepo.save(newUser);
    this.logger.log('createOne: user from DB', createdUser);
    return createdUser;
  }
}
