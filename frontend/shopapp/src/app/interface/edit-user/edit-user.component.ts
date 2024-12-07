import { Component } from '@angular/core';
import { UserDTO } from '../../dtos/user/user.dto';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { TokenService } from '../../service/token.service';
import { UserResponce } from '../../responce/user.responce';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {
userDTO:UserDTO
email:string
name:string
phone:string
userResponce?:UserResponce
constructor(private router: Router, private userService: UserService,private tokenService: TokenService) {
  this.email = "";
  this.name = "";
  this.phone = "";
  const userJson = localStorage.getItem("user");
  if (userJson) {
    const userData = JSON.parse(userJson);
    this.userDTO = new UserDTO(userData); // Create UserDTO from local storage data
  } else {
    // If no user in local storage, use default data
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890"
    };
    this.userDTO = new UserDTO(userData);
  }
}
editUser(){
  const userDTO2: UserDTO = {

    email: this.email || this.userDTO.email,
    phone: this.phone || this.userDTO.phone,
    name: this.name || this.userDTO.name
  }
  this.userService.editUser(userDTO2).subscribe({
    next: (response: any) => {

      const { token } = response
      this.tokenService.setToken(token)
      this.userService.getUserfromJWT(token).subscribe({
        next: (responce: any) => {
          this.userResponce={
            name:responce.name,
            email:responce.email,
            phone:responce.phone,
            role:responce.role
          }
          this.userService.saveUsertoLocalStorage(this.userResponce);
          this.router.navigateByUrl('/home')
        },
        complete: () => { },
        error: (error: any) => {
          alert('error.error.message');
        }
      })

    },
    complete: () => { },
    error: (error: any) => {
      debugger
      alert('Email has been created');
    }
  });
}
}
