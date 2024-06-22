import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { response } from 'express';
import { error } from 'console';
import { UserService } from '../../service/user.service';
import { RegisterDTO } from '../../dtos/user/register.dto';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  @ViewChild("registerForm") registerForm! :NgForm;
  name: string;
  phone: string;
  email: string;
  password: string;
  repassword: string;
  constructor(private router:Router, private userService: UserService) {
    this.name="";
    this.phone="";
    this.email="";
    this.password="";
    this.repassword="";
  //inject

  }
  onChangeEmail() {
    console.log(`Email type: ${this.name}`)
  }
  dangky(){
    const registerDTO:RegisterDTO= {
      "name": this.name,
      "email": this.email,
      "password": this.password,
      "phone":this.phone,
      "role":"1"
    }
   this.userService.register(registerDTO).subscribe({
    next: (response: any) => {
      // xy ly khi dang nhap thanh cong
      if(response && (response.status === 200 || response.status===201)) {
        this.router.navigate(['/login'])
      }
    },
    complete:() => {debugger},
    error: (error: any) => {
      alert('Email has been created');
    } 
   })
  }
  // checkPasswordMatch() {
  //   if (this.password != this.repassword) {
  //     this.registerForm.form.controls['repassword'].setErrors({'passwordMismatch':true})
  //   }
  // }
}
