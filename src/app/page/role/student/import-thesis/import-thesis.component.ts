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
  hasThesis_FileDeleted = false;
  hasRejected = false;
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
    this.stdService.hasThesis();
    this.stdService.ThesisHasReject();
    this.stdService.ThesisHasDeleted();

  }

  ngOnInit(): void {

    this.stdService.thesishasReject$.subscribe(status=>{
      this.hasRejected = status
      
    }) 


    this.stdService.thesisStatus$.subscribe(status=>{
      this.hasThesis = status
    }) 

    


    
     
    if(this.hasThesis && !this.hasRejected){
       
      Swal.fire({
        title:'คุณได้นำเข้าเอกสารแล้ว',
        text: 'กำลังเข้าสู่หน้าปริญญานิพนธ์ของฉัน',
        showCancelButton: false, // ซ่อนปุ่ม Cancel
        showConfirmButton: false, // ซ่อนปุ่ม Confirm
        willOpen: () => {
            Swal.showLoading(); // แสดง loading
        },
        didOpen: () => {
            // const loader = document.createElement('div');
            // loader.className = 'loader';
    
            // const container = Swal.getHtmlContainer();
            // if (container) { // เช็คว่า container ไม่ใช่ null
            //     container.appendChild(loader); // เพิ่ม loader ลงใน SweetAlert
            // }
    
            // ตั้งเวลาหลังจาก 1 วินาที
            setTimeout(() => {
                Swal.close(); // ปิด SweetAlert
                this.route.navigate(['/account/student/thesis']); // นำทางไปยังหน้าใหม่
            }, 1000); // 1000 ms = 1 s
        },
    });
    
    // ฟังก์ชันสำหรับอัพโหลดเอกสารใหม่

    
      
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
 
  validDateForm(){
    const checkValidate = !this.form_import.advisor_id && !this.form_import.title_th && !this.form_import.title_en && !this.form_import.year
    
    return checkValidate;

  }
      

  onSubmit() {

    if(this.validDateForm()){
      Swal.fire({
        icon: 'warning',
        text: 'กรุณากรอกข้อมูลให้ครบ',
      });
      return;
    }
    if (!this.form_import.file) {
      Swal.fire({
        icon: 'warning',
        text: 'กรุณาเลือกไฟล์ปริญญานิพนธ์ก่อนที่จะส่งข้อมูล',
      });
      return;
    }


    if(!this.form_import.file){
      
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
        }).then(()=>{
          this.route.navigate(['/account/student/thesis'])

        })
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
