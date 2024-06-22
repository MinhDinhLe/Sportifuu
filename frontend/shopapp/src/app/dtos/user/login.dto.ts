import {
    IsString,IsNotEmpty,IsEmail
} from 'class-validator';
export class LoginDTO {
    
    email:string;
    password:string;
    constructor(data: any) {
        this.email=data.email;
        this.password=data.password
    }
}