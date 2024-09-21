import { IsNotEmpty, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client'; 

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'Unique email of the user' })
  email: string;

  @IsOptional()
  @ApiProperty({ description: 'Name of the user', required: false })
  name?: string;

  @IsOptional()
  @ApiProperty({ description: 'Address of the user', required: false })
  address?: string;

  @IsOptional()
  @ApiProperty({ description: 'Gender of the user', enum: Gender, required: false })
  @IsEnum(Gender, { message: 'Gender must be either MALE, FEMALE, or OTHER' }) // Validasi untuk enum
  gender?: Gender; // Menggunakan tipe enum Gender

  @IsOptional()
  @ApiProperty({ description: 'Marital status of the user', required: false })
  status_married?: string;
}
