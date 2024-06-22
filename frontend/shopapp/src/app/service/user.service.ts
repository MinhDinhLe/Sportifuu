import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { register } from 'module';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { UserResponce } from '../responce/user.responce';
import { TokenService } from './token.service';
import { UserDTO } from '../dtos/user/user.dto';
interface HistoryItem {
  trackTitle: string;
  singerName: string;
  listenedAt: Date;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private  apiRegister = "http://localhost:8080/api/adduser";
  private  apiLogin = "http://localhost:8080/login";
  private  apiUserDetails = "http://localhost:8080/getauth";
  private apiEditUser= "http://localhost:8080/editUser";

  constructor(private http:HttpClient,private tokenService: TokenService) {
   }
   register(registerDTO: RegisterDTO):Observable<any> {
    return this.http.post(this.apiRegister,registerDTO )
  }
  login(loginDTO:LoginDTO):Observable<any> {
    return this.http.post(this.apiLogin,loginDTO)
  }
  editUser(userDTO:UserDTO):Observable<any> {
    return this.http.post(this.apiEditUser,userDTO)
  }
  getUserfromJWT(token:String) {
    return this.http.post(this.apiUserDetails,{
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    })
  }
  saveUsertoLocalStorage(userResponce:UserResponce) {
    try{
      if  (userResponce==null||!userResponce){return;}
      const userResponceJSON=JSON.stringify(userResponce);
      localStorage.setItem('user',userResponceJSON);
      console.log('User has been save in localstorage');
    } catch(error) {
        console.error("Have some error when save it to localstorage",error);
    }
  }
  getCurrentUser(): UserDTO{
    const userJson = localStorage.getItem("user");
     return userJson ? JSON.parse(userJson) : null;
  }
  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null && !this.tokenService.isTokenExpired();
  }
  logout() {
    // Xóa dữ liệu trong localStorage
    localStorage.clear();

    // Cập nhật trạng thái đăng nhập
    // Ví dụ: đặt giá trị của một biến trạng thái về false
  }
  addToHistory(trackTitle: string, singerName: string): void {
    const user = this.getCurrentUser();
    if (user) {
      let history = this.getHistory(user.email);
      const newItem: HistoryItem = {
        trackTitle,
        singerName,
        listenedAt: new Date()
      };
      history.push(newItem);
      localStorage.setItem(`history_${user.email}`, JSON.stringify(history));
    }
  }

  getHistory(userEmail: string): HistoryItem[] {
    const historyStr = localStorage.getItem(`history_${userEmail}`);
    return historyStr ? JSON.parse(historyStr) : [];
  }

  clearHistory(userEmail: string): void {
    localStorage.removeItem(`history_${userEmail}`);
  }
}
