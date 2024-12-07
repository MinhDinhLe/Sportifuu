import { Component } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { SingerDTO } from '../../dtos/singer/singer.dto';
import { AdminService } from '../../service/admin.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  singers: SingerDTO[]
  displayedSingers: (SingerDTO | null)[] = [];
  tracks: any[]; // Hoặc sử dụng một interface cụ thể cho Track
  genres: string[];
  tracksByGenre: { [genre: string]: any[] };
  currentIndex: number = 0;
  currentIndexByGenre: { [genre: string]: number } = {};
  selectedTrack: any = null; 
  
  constructor(private router: Router, private userService: UserService,private adminService: AdminService){
    this.singers = [];
    this.tracks = [];
    this.genres = [];
    this.tracksByGenre = {};
  }
  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
  logout() {
    this.userService.logout();
    this.router.navigate(['/home']);
  }
  details(name:String) {
    this.router.navigate(['/details', name]); 
  }
  detailsTrack(title:String) {
    this.router.navigate(['/detailsTrack', title]); 
  }
  logAdmin() {
    this.router.navigate(['/homeAdmin']);
  }
  ngOnInit(): void {
    this.getSingers();
    this.getTracks();
  }
  //---------------------GET TRACK THEO GENRE----------------//
  getTracks() {
    this.adminService.getSong().subscribe(
      (data: any[]) => {
        this.tracks = data;
        this.processTracksByGenre();
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách track:', error);
      }
    );
  }
  processTracksByGenre() {
    this.tracksByGenre = {};
    this.currentIndexByGenre = {};
    this.tracks.forEach(track => {
      if (!this.tracksByGenre[track.genre]) {
        this.tracksByGenre[track.genre] = [];
        this.currentIndexByGenre[track.genre] = 0;
      }
      this.tracksByGenre[track.genre].push(track);
    });
    this.genres = Object.keys(this.tracksByGenre);
  
    // Đảm bảo mỗi thể loại có ít nhất 4 phần tử
    this.genres.forEach(genre => {
      while (this.tracksByGenre[genre].length < 4) {
        this.tracksByGenre[genre].push(null);
      }
    });
  }

  nextTracks(genre: string) {
    const tracks = this.tracksByGenre[genre];
    if (this.currentIndexByGenre[genre] + 4 < tracks.length) {
      this.currentIndexByGenre[genre] += 4;
    }
  }

  previousTracks(genre: string) {
    if (this.currentIndexByGenre[genre] - 4 >= 0) {
      this.currentIndexByGenre[genre] -= 4;
    }
  }

  getDisplayedTracks(genre: string): (any | null)[] {
    const startIndex = this.currentIndexByGenre[genre];
    const tracks = this.tracksByGenre[genre].slice(startIndex, startIndex + 4);
    while (tracks.length < 4) {
      tracks.push(null);
    }
    return tracks;
  }
  //------------------Get Singer----------------------//
  getSingers() {
    this.adminService.getAllSinger().subscribe(
      (data: SingerDTO[]) => {
        this.singers = data;
        this.updateDisplayedSingers();
      },
      (error) => {
        debugger
        console.error('Lỗi khi lấy danh sách ca sĩ:', error);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
      }
    );
  }
  updateDisplayedSingers() {
    const remainingSingers = this.singers.length - this.currentIndex;
    const displayCount = Math.min(4, remainingSingers);
    this.displayedSingers = this.singers.slice(this.currentIndex, this.currentIndex + displayCount);
    
    // Thêm các phần tử trống nếu không đủ 4 nghệ sĩ
    while (this.displayedSingers.length < 4) {
      this.displayedSingers.push(null);
    }
  }

  nextSingers() {
    if (this.currentIndex + 4 < this.singers.length) {
      this.currentIndex += 4;
      this.updateDisplayedSingers();
    }
  }

  previousSingers() {
    if (this.currentIndex - 4 >= 0) {
      this.currentIndex -= 4;
      this.updateDisplayedSingers();
    }
  }
}
