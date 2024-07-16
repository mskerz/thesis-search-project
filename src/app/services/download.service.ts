import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private http:HttpClient,private auth:AuthService) { }
  downloadPDF(docId: number): Observable<Blob> {
    const url = `${this.auth.getEndpoint()}/download-file/${docId}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
