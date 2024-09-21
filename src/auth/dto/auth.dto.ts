
import { IsNotEmpty } from "@nestjs/class-validator";
import {ApiProperty} from "@nestjs/swagger";
export class LoginUserDto {
    @ApiProperty()
    @IsNotEmpty() readonly email: string;

    @ApiProperty()
    @IsNotEmpty() readonly password: string;
}
export class RegisterUserDto {
    @IsNotEmpty()
    @ApiProperty() name: string;
    @IsNotEmpty()
    @ApiProperty() email: string;
    @ApiProperty()
    @IsNotEmpty() password: string;

}
export class UpdatePasswordDto {

    @IsNotEmpty()
    @ApiProperty() new_password: string;

    @IsNotEmpty()
    @ApiProperty() old_password: string;

}