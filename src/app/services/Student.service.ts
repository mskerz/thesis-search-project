import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { ThesisCheckResponse } from '../models/hasThesis.model';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private hasThesisStatus = new BehaviorSubject<boolean>(false);
  thesisStatus$ = this.hasThesisStatus.asObservable();

  constructor(private http:HttpClient,private auth:AuthService) { }
   
  getStudent(): Observable<Student[]> {
    return this.auth.getUserRole().pipe(
      switchMap(role => {
        if (role === 1) {
          return this.http.get<Student[]>(`${this.auth.getEndpoint()}/student-all`);
        } else {
          // Return an empty array or handle other roles accordingly
          return of([]); // 'of' creates an Observable of an empty array
        }
      })
    );
  }

    // New method: Change student's role
    changeStudentRole(userId: number): Observable<any> {
      return this.auth.getUserRole().pipe(
        switchMap(role => {
          if (role === 1) {
            // Send PUT request to change the student's role to admin
            return this.http.put(`${this.auth.getEndpoint()}/change_role_student/${userId}`, {});
          } else {
            // If the user is not an admin, return an error or empty Observable
            return of({ message: 'Permission denied', status_code: 403 });
          }
        })
      );
    }
  


  importThesis(formData: FormData): Observable<any> {
    return this.http.post(`${this.auth.getEndpoint()}/student/import-thesis`, formData);
  }

  checkThesis(): Observable<ThesisCheckResponse> {
    return this.http.get<ThesisCheckResponse>(`${this.auth.getEndpoint()}/check-thesis`);
  }

  updateThesisStatus() {
    this.auth.getUserRole().subscribe(role=>{
      if (role === 0) {  // ตรวจสอบว่า role เท่ากับ 0 หรือไม่
        this.checkThesis().subscribe(data => {
          this.hasThesisStatus.next(data.has_thesis);
        });
      } 
    })
    
  }
}
