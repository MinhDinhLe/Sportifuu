import { Component } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-header-after-signin',
  templateUrl: './header-after-signin.component.html',
  styleUrl: './header-after-signin.component.scss'
})
export class HeaderAfterSigninComponent {
  constructor(private userService:UserService,private router: Router,private http: HttpClient){
  }

  showAddForm = false;
  selectedFiles: File[] = []; // Lưu trữ file đã chọn
  audioBlob: Blob | null = null; // Thêm thuộc tính để lưu trữ Blob âm thanh
  searchResult: any;
  mediaRecorder: MediaRecorder | null = null; // Thêm thuộc tính để lưu trữ MediaRecorder
  logout() {
    this.userService.logout();
  }
  logAdmin() {
    this.router.navigate(['/homeAdmin']);
  }
  editUser() {
    this.router.navigate(['/editUser']);
  }
  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      this.mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      };

      this.mediaRecorder.start();
    }).catch(error => {
      console.error('Lỗi khi bắt đầu ghi âm:', error);
    });
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop(); // Dừng ghi âm
      this.mediaRecorder = null; // Đặt lại mediaRecorder
    } else {
      console.error('Không có mediaRecorder để dừng ghi âm.');
    }

    if (this.audioBlob) {
      const formData = new FormData();
      formData.append('file', this.audioBlob, 'recording.wav');

      this.http.post('http://localhost:8080/admin/recognizeSong', formData).subscribe(response => {
        console.log('Kết quả tìm kiếm:', response);
      }, error => {
        console.error('Lỗi khi tìm kiếm bài hát:', error);
      });
    } else {
      console.error('Không có âm thanh nào được ghi lại.');
    }
  }
}
