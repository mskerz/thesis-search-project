import { Component, OnInit } from '@angular/core';
import { ThesisCheckConvert, ThesisResponse } from 'src/app/models/hasThesis.model';
import { StudentService } from 'src/app/services/Student.service';

@Component({
  selector: 'app-my-thesis',
  templateUrl: './my-thesis.component.html',
  styleUrls: ['./my-thesis.component.scss']
})
export class MyThesisComponent implements OnInit  {
  my_thesis!:ThesisResponse
  hasDeleted = false
  constructor(private student : StudentService ){
    this.student.updateThesisStatus()
  }
  ngOnInit(){
    this.FetchMyThesis()
  }
  getStatusText(status: number): string {
    switch (status) {
      case 1: return 'Approved';
      case 2: return 'Rejected';
      default: return 'Waiting';
    }
  }

  FetchMyThesis(){
    this.student.checkThesis().subscribe((data=>{
      this.hasDeleted = data.has_deleted
      this.my_thesis = ThesisCheckConvert.fromJson_toThesis(JSON.stringify(data.thesis))
    }))
  }
}
 
