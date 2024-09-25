import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

// ตัวเช็คโทเค็นว่า หากหมดอายุ ให้ logout 
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService:AuthService,private cookie:CookieService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const access_token = this.cookie.get('access_token');
    let authRequest= request
    
    
    if(access_token){
        authRequest = request.clone({
            setHeaders:{
              Authorization: 'Bearer ' + access_token
            }
        }
      );      
    }

    return next.handle(authRequest).pipe(
      catchError((error:HttpErrorResponse)=>{
        
        if (error.status === 401) {
          // If a 401 Unauthorized response is returned, log out the user
          this.authService.logout();
          // Swal.fire({
          //   title: 'Session Expired',
          //   text: 'กำลังกลับไปที่หน้าเข้าสู่ระบบ',
          //   timer:2000,
          //   didOpen: () => {
          //     Swal.showLoading();
          //   }
          // }).then(() => {
          //   this.authService.logout();// Navigate after Swal is closed
          // });
        }
        return throwError(()=>error);
      })
    );
  }
}
