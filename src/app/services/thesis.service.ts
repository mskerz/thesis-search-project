import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ThesisUploadList } from '../models/ThesisUpload.model';

@Injectable({
  providedIn: 'root'
})
export class ThesisService {

  constructor(private auth:AuthService,private http:HttpClient) { }

  getThesess():Observable<ThesisUploadList[]>{
    return this.http.get<ThesisUploadList[]>(`${this.auth.getEndpoint()}/record/thesess-upload`);
  }
  
}
