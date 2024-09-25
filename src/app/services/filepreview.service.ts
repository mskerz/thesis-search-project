import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FilePreviewService {

  userRole:number = 0;
  constructor(private http: HttpClient, private auth: AuthService) {
    this.auth.getUserRole().subscribe(role => {
      this.userRole = role!;
    });
  }

   
  getFilePreview(filename: string): Observable<Blob> {
    return this.auth.getUserRole().pipe(
      switchMap(role => {
        if (role !== 1) {
          return throwError(() => new Error('Permission denied'));
        }
        return this.http.get(`${this.auth.getEndpoint()}/file-preview/${filename}`, { responseType: 'blob' }).pipe(
          catchError(error => {
            return throwError(() => new Error('Error fetching file preview'));
          })
        );
      }),
      catchError(error => {
        // Handle errors from both `getUserRole` and HTTP requests
        return throwError(() => error);
      })
    );
  }
}
