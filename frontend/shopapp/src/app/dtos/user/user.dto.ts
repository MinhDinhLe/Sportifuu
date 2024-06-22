export class UserDTO {
    name: string;
    email: string;
    phone: string;
    constructor(data: any) {
        this.name=data.name;
        this.email=data.email;
        this.phone=data.phone;
    }
}