import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt'
import { PrismaService } from "../prisma/prisma.service";
import { User } from '@prisma/client'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto, RegisterUserDto, UpdatePasswordDto } from 'src/auth/dto/auth.dto';
import { FormatLogin } from 'src/interface/login.interface';
import { UserInterface } from 'src/interface/user.interface';
import { RedisService } from 'src/redis/redis.service';



@Injectable()
export class UsersService {

  constructor(@Inject(RedisService)private readonly redisService: RedisService,
    private prisma: PrismaService,
  ) {
  }

  async findOne(id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        gender: true,
        status_married: true,
      },
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });
    if (!user) {
      throw new HttpException("invalid_credentials",
        HttpStatus.UNAUTHORIZED);
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto
    });
  }


  async register(registerUserDto: RegisterUserDto): Promise<any> {
    const userInDb = await this.prisma.user.findFirst({
      where: { email: registerUserDto.email }
    });
    if (userInDb) {
      throw new HttpException("user_already_exist",
        HttpStatus.CONFLICT);
    }

    console.log('Creating user with DTO:', registerUserDto);

    return await this.prisma.user.create({
      data: {
        ...registerUserDto,
        password: await hash(registerUserDto.password, 10)
      }
    });
  }



  async findByLogin({ email, password }: LoginUserDto):
    Promise<FormatLogin> {
    const user = await this.prisma.user.findFirst({
      where: { email }
    });

    if (!user) {
      throw new HttpException("invalid_credentials",
        HttpStatus.UNAUTHORIZED);
    }

    // compare passwords
    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      throw new HttpException("invalid_credentials",
        HttpStatus.UNAUTHORIZED);
    }

    const userdata: UserInterface = await  this.prisma.user.findFirst({
      where: { email }
    });
    await this.redisService.saveUser(`${user.email}`, userdata);
    const { password: p, ...rest } = user;
    return rest;
  }

  async findByPayload({ email }: any): Promise<any> {

    const data = await this.redisService.getUser(String(email));
    if (data) {
        console.log('Cache hit!: Users found in Redis');
        return { data };
    }
  
  }


  async logout( email : string): Promise<any> {
    console.log(email);
    const postdata = await this.redisService.removeUser(email);
    if (postdata) {
        console.log('Cache hit!: Users found in Redis');
        return { message: "users success logout" };
    }else{
      return { message: "users success logout" };
    }
  
  }

  async updatePassword(payload: UpdatePasswordDto, id: number):
    Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });
    if (!user) {
      throw new HttpException("invalid_credentials",
        HttpStatus.UNAUTHORIZED);
    }
    // compare passwords
    const areEqual = await compare(payload.old_password,
      user.password);
    if (!areEqual) {
      throw new HttpException("invalid_credentials",
        HttpStatus.UNAUTHORIZED);
    }
    return await this.prisma.user.update({
      where: { id },
      data: { password: await hash(payload.new_password, 10) }
    });
  }
}


