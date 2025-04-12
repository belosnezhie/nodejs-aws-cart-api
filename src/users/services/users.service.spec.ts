import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';

//Entities
import { Cart } from '../../db/cart.entity';
import { CartItem } from '../../db/cart.item.entity';
import { Users } from '../../db/user.entity';
import { Orders } from '../../db/order.entity';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [Cart, CartItem, Users, Orders],
          // synchronize: true,
          ssl: {
            rejectUnauthorized: false,
          },
        }),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
