import { Injectable } from '@angular/core';
import { Thesis } from '../models/thesis.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';
import { ThesisList } from '../models/thesisList.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http:HttpClient,private cookie:CookieService,private auth:AuthService) { }


  SimpleSearch(field:string,query:string): Observable<any>{
    return this.http.get<any>(`${this.auth.getEndpoint()}/search/simple/${field}/${query}`)
  }

  AdvancedSearch(query: string): Observable<any> {
    return this.http.get<any>(`${this.auth.getEndpoint()}/search/advance/${encodeURIComponent(query)}`)

  }

  ThesisDecription(doc_id:number): Observable<Thesis>{
    const token = this.cookie.get('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Thesis>(`${this.auth.getEndpoint()}/description/${doc_id}`,{headers})
  }
}
