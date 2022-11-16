import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

import { User } from '../../modules/users/shared/entities/user.entity';
import { IAccessTokenPayload } from '../../modules/users/shared/models/access-token-payload';
import { IUser } from '../../modules/users/shared/models/user.model';
import { UsersService } from '../../modules/users/users.service';
import { ErrorConstraint } from '../../shared/enums/error-constraints.enum';
import { SignInDto } from './shared/dto/sign-in.dto';
import { SignUpDto } from './shared/dto/sign-up.dto';

@Injectable()
export class AuthService {
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  public async signUp(signUpDto: SignUpDto): Promise<IUser> {
    try {
      const user: User = await this.usersService.signUp(signUpDto);
      delete user.salt;
      delete user.password;
      const accessTokenPayload: IAccessTokenPayload = { profile: user };
      const accessToken: string = this.jwtService.sign(accessTokenPayload);

      return { accessToken };
    } catch (error) {
      if (error.constraint === ErrorConstraint.emailError) {
        throw new ConflictException({
          error: await this.i18n.translate('en.ERRORS.AUTH.EMAIL_EXISTS', {
            lang: 'en',
          }),
        });
      }

      if (error.constraint === ErrorConstraint.usernameError) {
        throw new ConflictException({
          error: await this.i18n.translate('en.ERRORS.AUTH.USERNAME_EXISTS', {
            lang: 'en',
          }),
        });
      }
      throw new InternalServerErrorException({
        error: await this.i18n.translate(
          'en.ERRORS.GENERAL.INTERNAL_SERVER_ERROR',
          {
            lang: 'en',
          },
        ),
      });
    }
  }

  public async signIn(signInDto: SignInDto): Promise<IUser> {
    const { identity, password } = signInDto;
    const user: User | null = await this.usersRepository.findOneBy(
      identity.includes('@') ? { email: identity } : { username: identity },
    );

    if (!user) {
      throw new UnauthorizedException({
        error: await this.i18n.translate('en.ERRORS.AUTH.INVALID_CREDENTIALS', {
          lang: 'en',
        }),
      });
    }

    if (await user.validatePassword(password)) {
      delete user.salt;
      delete user.password;
      const accessTokenPayload: IAccessTokenPayload = { profile: user };
      const accessToken: string = this.jwtService.sign(accessTokenPayload);

      return { accessToken };
    }

    throw new UnauthorizedException({
      error: await this.i18n.translate('en.ERRORS.AUTH.INVALID_CREDENTIALS', {
        lang: 'en',
      }),
    });
  }
}
