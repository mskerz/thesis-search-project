import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Thesis, ThesisConvert } from 'src/app/models/thesis.model';
import { AuthService } from 'src/app/services/auth.service';
import { DownloadService } from 'src/app/services/download.service';
import { SearchService } from 'src/app/services/search.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-thesis-decription',
  templateUrl: './thesis-decription.component.html',
  styleUrls: ['./thesis-decription.component.scss']
})
export class ThesisDecriptionComponent implements OnInit {
  doc_id:number = 0;
  SelectedThesis:Thesis|null = null;
  loggedIn: Observable<boolean>;

  constructor(private route:ActivatedRoute,private search:SearchService,private authService:AuthService,private downloadService:DownloadService){
    this.loggedIn = this.authService.isLoggedIn()
  }
  url!: string;
 ngOnInit(): void {
  this.route.params.subscribe(params=>{
    this.doc_id = parseInt(params['doc_id']);
     this.search.ThesisDecription(this.doc_id).subscribe(data=>{
      this.SelectedThesis = ThesisConvert.fromJson_toThesis(JSON.stringify(data));

    })
    this.url = "http://localhost:4200/"+this.route.snapshot.url.join('/');


    })
  
  // console.log(this.selected_thesis);
 }



 Download_PDF(author_name:string,doc_id:number| undefined){
  this.downloadService.downloadPDF(doc_id!).subscribe(
    (data: Blob) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Thesis_${author_name}_สำเนา.pdf`;  // กำหนดชื่อไฟล์ที่นี่
      a.click();

      // ปิด URL object เมื่อไม่ใช้แล้ว
      window.URL.revokeObjectURL(url);
    },
    error => {
       // จัดการเมื่อเกิดข้อผิดพลาด
       console.error(error);
       
      //  Swal.fire({
      //   icon:'error',
      //   title:'ขออภัย',
      //   text: 'ไม่สามารถดาวน์โหลดได้ เนื่องจากไฟล์นี้อาจถูกลบไปแล้ว',
      // })
    }
  );
 }


 

}
