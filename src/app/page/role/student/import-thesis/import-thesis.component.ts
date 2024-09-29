import { Component, OnInit } from '@angular/core';
import { Advisor } from 'src/app/models/advisor.model';
import { ThesisCheckConvert, ThesisCheckResponse, ThesisResponse } from 'src/app/models/hasThesis.model';
import { AdvisorService } from 'src/app/services/advisor.service';
import { StudentService } from 'src/app/services/Student.service';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-import-thesis',
  templateUrl: './import-thesis.component.html',
  styleUrls: ['./import-thesis.component.scss'],
})
export class ImportThesisComponent implements OnInit {
  Advisors = Array<Advisor>();
  hasThesis = false;
  userRole: number | null = null;
  hasDeletedThesis = false;
  form_import = {
    title_th: '',
    title_en: '',
    advisor_id: 0,
    year: 2566,
    file: null,
  };
  isLoading = false; // ตัวแปรสำหรับจัดการสถานะการโหลด


  constructor(
    private advisor: AdvisorService,
    private stdService: StudentService,
    private route:Router
  ) {

  }

  ngOnInit(): void {
    this.stdService.thesisStatus$.subscribe(status=>{
      this.hasDeletedThesis = status
    }) 
    if(!this.hasDeletedThesis){
      this.route.navigate(['/account/student/thesis'])
    }
    
    this.advisor.fetchAdvisorAll().subscribe(
      (data) => {
        this.Advisors = data;
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  onFileChange(event: any) {
    this.form_import.file = event.target.files[0];
  }

  onEdit(){

  }

  onSubmit() {
    if (!this.form_import.file) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาเลือกไฟล์',
        text: 'กรุณาเลือกไฟล์วิทยานิพนธ์ก่อนที่จะส่งข้อมูล',
      });
      return;
    }
    const formData = new FormData();
    formData.append('title_th', this.form_import.title_th);
    formData.append('title_en', this.form_import.title_en);
    formData.append('advisor_id', this.form_import.advisor_id.toString());
    formData.append('year', this.form_import.year.toString());
    formData.append('file', this.form_import.file);
    this.isLoading = true; // ตั้งค่าการโหลดเป็น true
    this.stdService.importThesis(formData).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: 'นำเข้าข้อมูลวิทยานิพนธ์สำเร็จแล้ว',
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'ล้มเหลว',
          text: 'ไม่สามารถนำเข้าข้อมูลวิทยานิพนธ์ได้',
        });
        this.isLoading = false; // ตั้งค่าการโหลดเป็น false หลังการทำงานเสร็จสิ้น

      },
      () => {
        this.isLoading = false; // ตั้งค่าการโหลดเป็น false หลังการทำงานเสร็จสิ้น
      }
    );
  }


}

// ImportThesis(form_import:any){
//   if(form_import){
//     console.log(form_import)
//   }else{
//     alert('กรุณากรอกข้อมูลให้ครับ')
//   }
// }
