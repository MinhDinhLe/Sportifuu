import { Component } from '@angular/core';
import { TrackDTO } from '../../dtos/singer/singer.dto';
import { AdminService } from '../../service/admin.service';
import { Router } from '@angular/router';
import { SingerDTO } from '../../dtos/singer/singer.dto';
import { AngularFireStorage } from '@angular/fire/compat/storage';
@Component({
  selector: 'app-song-admin',
  templateUrl: './song-admin.component.html',
  styleUrl: './song-admin.component.scss'
})
export class SongAdminComponent {
  singers: SingerDTO[]
  tracks:TrackDTO[]
  showAddForm = false;
  selectedFiles: File[] = []; // Lưu trữ file đã chọn
  newTrack: TrackDTO={
    title: '',
    image:'',
    duration:0,
    genre: '',
    fileUrl: '',
    selectedSinger:''
  }
  constructor(private router: Router,private adminService: AdminService,private storage: AngularFireStorage) {
    this.singers = [];
    this.tracks=[];
  }
  ngOnInit(): void {
    this.adminService.getAllSinger().subscribe(
      (data: SingerDTO[]) => {
        this.singers = data;
      },
      (error) => {
        debugger
        console.error('Lỗi khi lấy danh sách bài hát:', error);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
      }
    );
    this.adminService.getSong().subscribe(
      (data:TrackDTO[]) => {
        this.tracks = data;
      },
      (error) => {
        debugger
        console.error('Lỗi khi lấy danh sách ca sĩ:', error);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
      }
    );
  }
  addTrack() {
    if (this.selectedFiles.length > 0) {
      const fileRef = this.storage.ref(`music/${this.selectedFiles[0].name}`);
      fileRef.put(this.selectedFiles[0]).then((uploadResult) => {
        uploadResult.ref.getDownloadURL().then((downloadURL) => {
          const newTrack: TrackDTO = {
            title: this.newTrack.title,
            image: this.newTrack.image,
            duration: this.newTrack.duration,
            genre: this.newTrack.genre,
            fileUrl: downloadURL,
            selectedSinger: this.newTrack.selectedSinger
          };
  
          this.adminService.addTrack(newTrack).subscribe(
            (response) => {
              console.log('Đã thêm bài hát:', response);
              // Xử lý logic sau khi thêm thành công, ví dụ: reset form, reload danh sách bài hát
              this.showAddForm = false;
            },
            (error) => {
              console.error('Lỗi khi thêm bài hát:', error);
              // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
            }
          );
        });
      });
    } else {
      // Xử lý trường hợp không có tệp được chọn
    }
  }
  deleteTrack(title:String) {
  this.adminService.deleteTrack(title).subscribe((response) => {
    console.log('Đã xóa bài hát:', response);
    // Xử lý logic sau khi thêm thành công, ví dụ: reset form, reload danh sách ca sĩ
    this.showAddForm = false;
  },
  (error) => {
    console.error('Lỗi khi xóa bài hát:', error);
    // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
  })
  }
  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
  }
}
