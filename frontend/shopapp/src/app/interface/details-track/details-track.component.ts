import { Component, HostListener } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';
import { AdminService } from '../../service/admin.service';
import { SingerDTO, TrackDTO } from '../../dtos/singer/singer.dto';
import { PlayerService } from '../../service/play.service';
@Component({
  selector: 'app-details-track',
  templateUrl: './details-track.component.html',
  styleUrl: './details-track.component.scss'
})
export class DetailsTrackComponent {
  title: string;
  showFooter = false; // Biến để kiểm soát hiển thị footer
  selectedTrack: any = null;
  trackDetails:any =null;
  currentTrack: any = null;
  isPlaying: boolean = true;
  track:TrackDTO = {  // Khai báo kiểu dữ liệu cho newSinger
    id: '',
    image:'',
    title: '',
    duration:0,
    genre: '',
    fileUrl: '',
    selectedSinger:''
  };

  constructor(private router: Router, private userService: UserService, private route: ActivatedRoute,private adminService: AdminService,private playerService: PlayerService)
  {this.title=""}
  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
  logout() {
    this.userService.logout();
    this.router.navigate(['/home']);
  }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('title')) {
        this.title = params.get('title')!; // Sử dụng ! để khẳng định giá trị không phải null
      }
      this.getTrackDetails();
    });
  }
  getTrackDetails() {
    this.adminService.getDetailsTrack(this.title).subscribe(
      (data: TrackDTO) => {
        this.track = data;
      },
      (error) => {
        debugger
        console.error('Lỗi khi lấy track:', error);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
      }
    );
  }
  playTrack(trackTitle: string, singerName: string) {
    this.playerService.startTrack(trackTitle, singerName);
  }
}
