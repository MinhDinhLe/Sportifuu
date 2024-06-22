import { Component, HostListener } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';
import { AdminService } from '../../service/admin.service';
import { SingerDTO } from '../../dtos/singer/singer.dto';
import { PlayerService } from '../../service/play.service';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  name: string;
  showFooter = false; // Biến để kiểm soát hiển thị footer
  selectedTrack: any = null;
  currentTrack: any = null;
  isPlaying: boolean = false;
  singers:SingerDTO = {  // Khai báo kiểu dữ liệu cho newSinger
    name: '', 
    imageUrl: '', 
    tracks: [], // Khởi tạo tracks là mảng rỗng
    showTracks: false

  };

  constructor(private router: Router, private userService: UserService, private route: ActivatedRoute,private adminService: AdminService,private playerService: PlayerService)
  {this.name=""}
  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
  logout() {
    this.userService.logout();
    this.router.navigate(['/home']);
  }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('name')) {
        this.name = params.get('name')!; // Sử dụng ! để khẳng định giá trị không phải null
      }
      this.getSingerDetails();
    });
  }
  getSingerDetails() {
    this.adminService.getDetailSinger(this.name).subscribe(
      (data: SingerDTO) => {
        this.singers = data;
      },
      (error) => {
        debugger
        console.error('Lỗi khi lấy ca sĩ:', error);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
      }
    );
  }

  @HostListener('click', ['$event.target'])
  onClick(target: HTMLElement) {
    const gridItem = target.closest('.grid-item');
    if (gridItem) {
      const trackIndex = this.singers.tracks.findIndex(track => track.title === gridItem.querySelector('.song-title')?.textContent);
      if (trackIndex !== -1) {
        this.selectTrack(this.singers.tracks[trackIndex]);
      }
    }
  }

  selectTrack(track: any) {
    this.selectedTrack = track;
    this.currentTrack = track;
    this.isPlaying = true; // Giả sử bài hát bắt đầu phát ngay khi được chọn
  }

  onTrackChange(newTrack: any) {
    this.selectTrack(newTrack);
  }
  updatePlayingStatus(isPlaying: boolean) {
    this.isPlaying = isPlaying;
  }
  playTrack(trackTitle: string, singerName: string) {
    this.playerService.startTrack(trackTitle, singerName);
  }
}
