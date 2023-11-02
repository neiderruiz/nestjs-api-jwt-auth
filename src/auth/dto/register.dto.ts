import { IsNotEmpty, IsString, IsEmail, Length, Validate } from 'class-validator';
import { UserExistConstraint } from '../constraint/user-exist.constraint';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Validate(UserExistConstraint)
  email: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
