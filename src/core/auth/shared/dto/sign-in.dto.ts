import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty()
  @IsString()
  public identity: string;

  @ApiProperty()
  @IsString()
  public password: string;
}
