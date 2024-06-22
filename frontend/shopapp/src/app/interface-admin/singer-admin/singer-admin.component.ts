import { Component } from '@angular/core';
import { SingerDTO } from '../../dtos/singer/singer.dto';
import { AdminService } from '../../service/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-singer-admin',
  templateUrl: './singer-admin.component.html',
  styleUrl: './singer-admin.component.scss'
})
export class SingerAdminComponent {
  singers: SingerDTO[]
  showAddForm = false;
  newSinger: SingerDTO = {  // Khai báo kiểu dữ liệu cho newSinger
    name: '', 
    imageUrl: '', 
    tracks: [], // Khởi tạo tracks là mảng rỗng
    showTracks: false
  };
  constructor(private router: Router,private adminService: AdminService) {
    this.singers = [];
  }
  ngOnInit(): void {
    this.getSingers();
  }

  getSingers() {
    this.adminService.getAllSinger().subscribe(
      (data: SingerDTO[]) => {
        this.singers = data;
      },
      (error) => {
        debugger
        console.error('Lỗi khi lấy danh sách ca sĩ:', error);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
      }
    );
  }
  addSinger() {
    this.adminService.addSinger(this.newSinger as SingerDTO).subscribe( 
      (response) => {
        console.log('Đã thêm ca sĩ:', response);
        // Xử lý logic sau khi thêm thành công, ví dụ: reset form, reload danh sách ca sĩ
        this.showAddForm = false;
      },
      (error) => {
        console.error('Lỗi khi thêm ca sĩ:', error);
        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
      }
    );
}
}
