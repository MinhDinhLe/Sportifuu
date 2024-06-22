import { Component } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header-after-signin',
  templateUrl: './header-after-signin.component.html',
  styleUrl: './header-after-signin.component.scss'
})
export class HeaderAfterSigninComponent {
  constructor(private userService:UserService,private router: Router){
  }
  logout() {
    this.userService.logout();
  }
  logAdmin() {
    this.router.navigate(['/homeAdmin']);
  }
  editUser() {
    this.router.navigate(['/editUser']);
  }
}
