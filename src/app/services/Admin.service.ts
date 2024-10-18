import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { Admin } from '../models/admin.model';
import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class AdminService {
    constructor(private auth: AuthService,private http:HttpClient) { }
    
    getAdminAll(): Observable<Admin[]> {
        return this.auth.getUserRole().pipe(
          switchMap(role => {
            if (role === 1) {
              return this.http.get<Admin[]>(`${this.auth.getEndpoint()}/admin-all`);
            } else {
              // Return an empty array or handle other roles accordingly
              return of([]); // 'of' creates an Observable of an empty array
            }
          })
        );
      }
}