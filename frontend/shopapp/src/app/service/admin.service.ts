import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { UserDTO } from '../dtos/user/user.dto';
import { TokenService } from './token.service';
import { SingerDTO, TrackDTO } from '../dtos/singer/singer.dto';
@Injectable({
    providedIn: 'root'
  })
export class AdminService{
    private  apiGetAllUser = "http://localhost:8080/admin/getuser";
    private  apiGetAllSinger = "http://localhost:8080/admin/getsinger";
    private  apiGetDetailSinger = "http://localhost:8080/admin/getdetailsinger";
    private  apiGetDetailTrack = "http://localhost:8080/admin/getdetailTrack";
    private  apiAddSinger = "http://localhost:8080/admin/addsinger";
    private  apiAddSong = "http://localhost:8080/admin/addtrack";
    private  apiGetSong = "http://localhost:8080/admin/getsong";
    private  apiDeleteSong = "http://localhost:8080/admin/deletesong";
    constructor(private http:HttpClient){}
    getAllUsers(): Observable<any> {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}` // Gắn token vào header
      });
  
      return this.http.get<UserDTO[]>(this.apiGetAllUser, { headers });
    }
    getAllSinger():Observable<any>{
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}` // Gắn token vào header
      });
  
      return this.http.get<UserDTO[]>(this.apiGetAllSinger, { headers });
    }
    getDetailSinger(name:String):Observable<any> {
      return this.http.post<SingerDTO[]>(this.apiGetDetailSinger,name);
    }
    getSong():Observable<any>{
      return this.http.get<SingerDTO[]>(this.apiGetSong);
    }
    getDetailsTrack(title:String):Observable<any> {
      return this.http.post<TrackDTO[]>(this.apiGetDetailTrack,title);
    }
  
    addSinger(singer: SingerDTO): Observable<any> {
      return this.http.post(this.apiAddSinger, singer);
    }
    addTrack(track:TrackDTO): Observable<any> {
      return this.http.post(this.apiAddSong, track);

    }
    deleteTrack(title:String):Observable<any> {
      return this.http.post(this.apiDeleteSong, title);

    }
}