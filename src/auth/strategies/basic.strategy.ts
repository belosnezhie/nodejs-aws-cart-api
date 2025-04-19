import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { BasicStrategy as Strategy } from 'passport-http';

import { AuthService } from '../auth.service';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(BasicStrategy.name);

  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {
    super();
  }

  async validate(username: string, pass: string): Promise<any> {
    this.logger.log('validate BasicStrategy', username, pass);

    const user = await this.authService.validateUser(username, pass);

    this.logger.log('Validated user', JSON.stringify(user));

    if (!user) {
      throw new UnauthorizedException();
    }

    const { password, ...result } = user;

    return result;
  }
}
