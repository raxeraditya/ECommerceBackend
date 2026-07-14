import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsString()
  email!: string;
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsEmail()
  email!: string;
  @IsString()
  @IsNotEmpty()
  password!: string;
}
