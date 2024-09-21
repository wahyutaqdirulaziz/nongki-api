import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    UseGuards,
    UseInterceptors,Request,
    Get
} from '@nestjs/common';
import { AuthService } from "./auth.service";
import { RegisterUserDto, LoginUserDto, UpdatePasswordDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RegistrationStatus } from 'src/interface/register.interface';
import { JwtAuthGuard } from './jwt-auth.guard';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('register')
    public async register(@Body() registerUserDto: RegisterUserDto):
        Promise<RegistrationStatus> {
        const result: RegistrationStatus = await
            this.authService.register(registerUserDto,);
        if (!result.success) {
            throw new HttpException(result.message,
                HttpStatus.BAD_REQUEST);
        }
        return result;
    }

    @Post('login')
    public async login(@Body() loginUserDto: LoginUserDto):
        Promise<any> {
        return await this.authService.login(loginUserDto);
    }


    @UseGuards(JwtAuthGuard)
    @ApiSecurity('access-key')
    @ApiBearerAuth()
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('change-password')
    public async changepassword(@Request() req,@Body() updatePasswordDto: UpdatePasswordDto):
        Promise<any> {
        return await this.authService.changePassword(req.user.data.id,updatePasswordDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiSecurity('access-key')
    @ApiBearerAuth()
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('logout')
    public async logout(@Request() req):
        Promise<any> {
        return await this.authService.logout(req.user.data.email);
    }

}