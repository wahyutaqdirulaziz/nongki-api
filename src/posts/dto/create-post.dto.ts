import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Title of the post' })
  title: string;

  @IsOptional()
  @ApiProperty({ description: 'Content of the post', required: false })
  content?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Published status of the post', default: false })
  published?: boolean;
}
