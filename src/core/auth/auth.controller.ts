import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { IUser } from '../../modules/users/shared/models/user.model';
import { AuthService } from './auth.service';
import { SignInDto } from './shared/dto/sign-in.dto';
import { SignUpDto } from './shared/dto/sign-up.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ description: 'successful sign up' })
  @ApiBadRequestResponse({ description: 'validation error' })
  @ApiInternalServerErrorResponse({ description: 'internal server error' })
  @Post('sign-up')
  public async signUp(@Body() signUpDto: SignUpDto): Promise<IUser> {
    return this.authService.signUp(signUpDto);
  }

  @ApiUnauthorizedResponse({ description: 'wrong credentials' })
  @ApiBadRequestResponse({ description: 'validation error' })
  @ApiAcceptedResponse({ description: 'successful sign in' })
  @HttpCode(202)
  @Post('sign-in')
  public async signIn(@Body() signInDto: SignInDto): Promise<IUser> {
    return this.authService.signIn(signInDto);
  }
}
