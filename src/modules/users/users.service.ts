import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SignUpDto } from '../../core/auth/shared/dto/sign-up.dto';
import { User } from './shared/entities/user.entity';

@Injectable()
export class UsersService {

  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
  }

  public async signUp(signUpDto: SignUpDto): Promise<any> {
    const salt: string = await bcrypt.genSalt();
    const user: User = this.usersRepository.create({
      ...signUpDto,
      password: await UsersService.hashPassword(signUpDto.password, salt),
      salt,
      active: true,
    });
    await user.save();

    return user;
  }

  private static async hashPassword(
    password: string,
    salt: string,
  ): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
