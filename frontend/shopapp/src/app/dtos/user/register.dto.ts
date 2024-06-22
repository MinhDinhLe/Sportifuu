export class RegisterDTO{
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
    constructor(data: any) {
        this.name=data.name;
        this.email=data.email;
        this.password=data.password;
        this.phone=data.phone;
        this.role=data.role || 1; 
    }
}