import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateBookmarkDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @MinLength(10)
  description: string;

  @IsUrl()
  link: string;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  categoryId: number;
}
