  import { Component } from '@angular/core';
  import { Router } from '@angular/router';
  import { UserService } from '../../service/user.service';
  import { AdminService } from '../../service/admin.service';
  import { UserDTO } from '../../dtos/user/user.dto';
  @Component({
    selector: 'app-home-admin',
    templateUrl: './home-admin.component.html',
    styleUrl: './home-admin.component.scss'
  })
  export class HomeAdminComponent {
    users: UserDTO[];
    constructor(private router: Router,private adminService: AdminService) {
      this.users = [];
    }
    logAdmin() {
      this.router.navigate(['/homeAdmin']);
    }
    ngOnInit() {  
      this.adminService.getAllUsers().subscribe(
        users => this.users = users,
        error => console.error(error)
      );
    }
  }
