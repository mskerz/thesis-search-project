import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { Admin } from '../models/admin.model';
import { AuthService } from './auth.service';
import { AdminDashboard } from '../models/dashboard.model';

@Injectable({providedIn: 'root'})
export class AdminService {
    constructor(private auth: AuthService,private http:HttpClient) { }
    // add github
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

    
    
    CreateAdmin(register_admin:any){
      return this.auth.getUserRole().pipe(
        switchMap(role => {
          if (role === 1) {
            return this.http.post<any>(`${this.auth.getEndpoint()}/admin/add`, register_admin);
          } else {
            // Return an empty array or handle other roles accordingly
            return of([]); // 'of' creates an Observable of an empty array
          }
        })
      );

    
      
    }

    deleteAdmin(user_id:number){
      return this.auth.getUserRole().pipe(
        switchMap(role => {
          if (role === 1) {
            return this.http.delete(`${this.auth.getEndpoint()}/admin/delete/${user_id}`);
          } else {
            // Return an empty array or handle other roles accordingly
            return of([]); // 'of' creates an Observable of an empty array
          }
        })
      );
    }


    getDashboard():Observable<AdminDashboard |null>{
      return this.auth.getUserRole().pipe(
        switchMap(role => {
          if (role === 1) {
            return this.http.get<AdminDashboard>(`${this.auth.getEndpoint()}/admin/dashboard`);
          } else {
            // Return an empty array or handle other roles accordingly
            return of(null); // 'of' creates an Observable of an empty array
          }
        })
      );
    }
    
}