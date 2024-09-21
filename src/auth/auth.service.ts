import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './jwt.strategy';
import { RegisterUserDto, LoginUserDto, UpdatePasswordDto } from './dto/auth.dto';
import { RegistrationStatus } from 'src/interface/register.interface';


@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) { }


    async register(userDto: RegisterUserDto):
        Promise<RegistrationStatus> {
        let status: RegistrationStatus = {
            success: true,
            message: "ACCOUNT_CREATE_SUCCESS",
        };

        try {
            status.data = await this.usersService.register(userDto);
        } catch (err) {
            status = {
                success: false,
                message: err,
            };
        }
        return status;
    }

    async changePassword(id : number ,updatePasswordDto: UpdatePasswordDto){
        return await this.usersService.updatePassword(updatePasswordDto,id);
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {
        const user = await
            this.usersService.findByLogin(loginUserDto);
        const token = this._createToken(user);

        return {
            ...token,
            data: user
        };
    }


    async logout(email: string): Promise<any> {
         
         console.log(email );
        return await this.usersService.logout(email);;
    }


    private _createToken({ email }): any {
        const user: JwtPayload = { email };
        const Authorization = this.jwtService.sign(user);
        return {
            expiresIn: process.env.EXPIRESIN,
            Authorization,
        };
    }



    async validateUser(payload: JwtPayload): Promise<any> {
        const user = await this.usersService.findByPayload(payload);
        if (!user) {
            throw new HttpException("INVALID_TOKEN",
                HttpStatus.UNAUTHORIZED);
        }
        return user;
    }
}


