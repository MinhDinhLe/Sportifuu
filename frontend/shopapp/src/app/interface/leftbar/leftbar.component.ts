import { Component, Input } from '@angular/core';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-leftbar',
  templateUrl: './leftbar.component.html',
  styleUrl: './leftbar.component.scss'
})
export class LeftbarComponent {
  @Input() currentTrack: any;
  @Input() isPlaying: boolean = false;
  showHistory: boolean = false;
  history: any[] = []; 

  constructor(private userService: UserService) {}

  toggleHistory() {
    this.showHistory = !this.showHistory; 
    if (this.showHistory) {
      const user = this.userService.getCurrentUser();
      if (user) {
        this.history = this.userService.getHistory(user.email); 
      }
    }
  }
}
