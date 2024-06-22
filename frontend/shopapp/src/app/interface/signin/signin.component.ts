import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { LoginDTO } from '../../dtos/user/login.dto';
import { TokenService } from '../../service/token.service';
import { UserResponce } from '../../responce/user.responce';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  email: string;
  password: string
  userResponce?:UserResponce
  constructor(private router: Router, private userService: UserService, private tokenService: TokenService) {
    this.email = "";
    this.password = "";
  }
  dangnhap() {
    const loginDTO: LoginDTO = {

      "email": this.email,
      "password": this.password,
    }
    this.userService.login(loginDTO).subscribe({
      next: (response: any) => {

        const { token } = response
        this.tokenService.setToken(token)
        this.userService.getUserfromJWT(token).subscribe({
          next: (responce: any) => {
            this.userResponce={
              name:responce.name,
              email:responce.email,
              phone:responce.phone,
              role: responce.role, // Lấy thêm trường role từ response
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
        alert('Email has been created');
      }
    })
  }
}
