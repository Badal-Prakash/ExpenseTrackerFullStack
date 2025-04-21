import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  private ApiUrl = 'http://localhost:5174/api/User/';
  private tokenKey = 'token';
  isloggedIn = signal(!!localStorage.getItem(this.tokenKey));

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
  getCurrentUser(): any {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (err) {
      return '';
    }
  }
  getCurrentUserId(): string {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return '';

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken?.nameid || null;
    } catch (err) {
      console.error('Invalid token:', err);
      return '';
    }
  }

  signup(formData: any): Observable<any> {
    return this.http.post<any>(this.ApiUrl + 'signup', formData);
  }
  login(formData: any): Observable<any> {
    this.isloggedIn.set(true);
    return this.http.post<any>(this.ApiUrl + 'login', formData);
  }
  saveToken(token: string) {
    localStorage.setItem('token', token);
    console.log('token saved : ', token);
  }
  logout() {
    localStorage.removeItem('token');
    console.log('logged out');
    this.isloggedIn.set(false);
  }
}
