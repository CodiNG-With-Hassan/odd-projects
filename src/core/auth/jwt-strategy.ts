import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { User } from '../../modules/users/shared/entities/user.entity';
import { IAccessTokenPayload } from '../../modules/users/shared/models/access-token-payload';

@Injectable()
// tslint:disable-next-line: no-inferred-empty-object-type
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  public async validate(
    accessTokenPayload: IAccessTokenPayload,
  ): Promise<User> {
    const user: User | null = await this.usersRepository.findOneBy({
      id: accessTokenPayload.profile.id,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
