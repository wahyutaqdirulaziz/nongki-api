import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor,Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Users-info')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('profile')
  findOne(@Request() req) {
    return this.usersService.findOne(Number(req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch()
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(Number(req.user.id), updateUserDto);
  }

}
