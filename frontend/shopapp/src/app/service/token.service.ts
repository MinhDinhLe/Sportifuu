import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
@Injectable({
    providedIn: 'root',
})

export class TokenService {
    private readonly TOKEN_KEY = 'access-token';
    private jwtHelperService = new JwtHelperService();
    constructor() { }
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }
    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }
    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }
    getEmail(): string {
        const token = this.getToken();
        if (token) {
          const decodedToken = this.jwtHelperService.decodeToken(token);
          return decodedToken.email;
        }
        return '';
      }
      isTokenExpired(): boolean {
        const token = this.getToken();
        if (token) {
          return this.jwtHelperService.isTokenExpired(token);
        }
        return true;
      }
      

}