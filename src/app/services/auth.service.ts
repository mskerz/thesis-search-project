import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, UserConvert } from '../models/user.model';
import { Router } from '@angular/router';
import { CacheService } from './Cache.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private endpoint = 'http://127.0.0.1:8000/api'
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private userRole = new BehaviorSubject<number | null>(null);
  private currentUser = new BehaviorSubject<User | null>(null);
  constructor(private http:HttpClient,private cookie:CookieService,private route:Router,private cacheQuery:CacheService) {
 
   }
  getEndpoint(){
    return this.endpoint
  }

  Register(register_data:any){
    return this.http.post<any>(this.endpoint+"/register", register_data);
  }

  login(credentials: { email: string, password: string }):Observable<any>{
    return this.http.post<any>(this.endpoint+"/login", credentials).pipe(
      tap(response => {
        if (response.status_code === 200) {
          
          this.cookie.set('access_token', response.access_token, 1/24, '/'); // Store access token in cookie for 1 day
          this.loggedIn.next(true);
          // console.log(response.access_token);
          this.verifyUser()
          
        }
      })
    );
  }

  verifyUser() {
    const token = this.cookie.get('access_token');

    if (token) {
      this.http.get<any>(this.endpoint+"/user/verify").subscribe(
        userInfo => {
          const user = UserConvert.json_toUser(JSON.stringify(userInfo));
          this.currentUser.next(user);
          this.userRole.next(userInfo.access_role);
          
         },
        error => {
          console.error('Verification failed', error);
         }
      );
    } 
  }
  

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }
  getUserRole(): Observable<number | null> {
    return this.userRole.asObservable();
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
  private hasToken (): boolean {
    return !!this.cookie.get('access_token')
  }
  sendEmail(email: string){
    return this.http.post<any>(this.endpoint+"/forgot-password",{"email": email})
  }

  ResetPassword(reset_password_data: { token: string, new_password: string }){
    return this.http.put<any>(this.endpoint+"/new-password", reset_password_data);
  }
 
  logout() {
    this.loggedIn.next(false);
    this.cookie.delete('access_token', '/', 'localhost', false, 'Lax');
    this.route.navigate(['/login']);
    this.cacheQuery.clearCache();
  }


  changeProfile(profile_change:any){
    const token = this.cookie.get('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(this.endpoint+'/change-info',profile_change,{headers});
  }

  changePassword(password_change:any){
    return this.http.put<any>(this.endpoint+'/change-password',password_change);
  }
}
