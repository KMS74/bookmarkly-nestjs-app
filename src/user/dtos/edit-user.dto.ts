import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export class EditUserDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  email: string;
}
