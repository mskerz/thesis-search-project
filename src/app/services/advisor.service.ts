import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Advisor } from '../models/advisor.model';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { faker } from '@faker-js/faker/locale/th';

@Injectable({
  providedIn: 'root',
})
export class AdvisorService {
  private prefix = ["รศ.ดร.","ผศ.ดร.","ผศ.","อ.ดร.","อ."]

  constructor(private http: HttpClient, private auth: AuthService) {}
  generateFakeAdvisor(){
    const randomPrefix = this.prefix[Math.floor(Math.random() * this.prefix.length)];
    const randomName = faker.name.fullName(); // หรือใช้ faker.name.firstName() + ' ' + faker.name.lastName() เพื่อแยกชื่อและนามสกุล

    return `${randomPrefix}${randomName}`

  }
  insertAdvisor(new_advisor: any) {
    return this.http.post(this.auth.getEndpoint() + '/advisor/new', new_advisor);
  }
  fetchAdvisorAll() {
    return this.http.get<Advisor[]>(this.auth.getEndpoint() + '/advisors');
  }

  getAdvisorById(advisorId: number): Observable<Advisor> {
    return this.http.get<Advisor>(`${this.auth.getEndpoint()}/advisors/${advisorId}`);
  }

  EditAdvisor(advisor_id: number, advisor: {advisor_name: string}) {
    return this.http.put(`${this.auth.getEndpoint()}/advisor/edit/${advisor_id}`,advisor);
  }
  deleteAdvisor(doc_id: number) {
    return this.http.delete(`${this.auth.getEndpoint()}/advisor/delete/${doc_id}`);
  }
}
