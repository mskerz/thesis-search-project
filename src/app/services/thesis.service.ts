import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ThesisUploadList } from '../models/ThesisUpload.model';
import { ThesisEdit } from '../models/thesisEdit.model';

@Injectable({
  providedIn: 'root',
})
export class ThesisService {
  private updateThesisSource = new BehaviorSubject<boolean>(false);
  updateThesis$ = this.updateThesisSource.asObservable();


  constructor(private auth: AuthService, private http: HttpClient) {}

  getThesess(): Observable<ThesisUploadList[]> {
    return this.http.get<ThesisUploadList[]>(
      `${this.auth.getEndpoint()}/record/thesess-upload`
    );
  }

  getThesisEditByID(doc_id: number):Observable<ThesisEdit>{
    return this.http.get<ThesisEdit>(
      `${this.auth.getEndpoint()}/thesis/id/${doc_id}`
    );
  }

  Recheck(doc_id: number, newStatus: number) {
    return this.http.put<any>(
      `${this.auth.getEndpoint()}/recheck-thesis/${doc_id}/?status=${newStatus}`,
      {}
    );
  }

  

  deleteThesis(doc_id: number) {
    return this.http.post<any>(`${this.auth.getEndpoint()}/thesis/delete/${doc_id}`,{});
  }

  editThesis(ThesisFormRequest:any,doc_id: number) {
    return this.http.put<any>(`${this.auth.getEndpoint()}/thesis/edit/${doc_id}`,ThesisFormRequest);
  }
}
