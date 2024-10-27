import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/Admin.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { faker } from '@faker-js/faker';
import { EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-admin-add',
  templateUrl: './admin-add.component.html',
  styleUrls: ['./admin-add.component.scss']
})
export class AdminAddComponent {
  // ใน class AdminAddComponent
  @Output() adminAdded = new EventEmitter<any>();
  form_register_admin ={
    email :faker.internet.email({provider:'gmail.com'}),
    password: '',
    confirm_password: '',
  }
  
  showHidePassword = false
  showHideConfirmPassword = false
  

  constructor(private adminService: AdminService,private router:Router, public dialogRef: MatDialogRef<AdminAddComponent>){}

  toggleHidePassword() {
    this.showHidePassword = !this.showHidePassword;

  }
  toggleHideConfirmPassword() {
    this.showHideConfirmPassword = !this.showHideConfirmPassword;
  }

  onSubmit() {
    if (!this.form_register_admin.email || !this.form_register_admin.password || 
      !this.form_register_admin.confirm_password ) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'กรุณากรอกข้อมูลให้ครบ!',
    });
    return;
  }

    if (this.form_register_admin.password != this.form_register_admin.confirm_password) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน!',
      });
      return;
    }

    const data={
      email:this.form_register_admin.email,
      password:this.form_register_admin.password,
      firstname:"Admin",
      lastname:"User"
      
    }
    this.adminService.CreateAdmin(data).subscribe(
      (res) => {
        if(res.status === 200) {
          const newAdmin = {
            idx: 0, // จะตั้งค่า idx หลังจากส่งข้อมูลกลับ
            user_id: res.last_user_id, // รับ user_id จากการตอบกลับ
            fullname: `${data.firstname} ${data.lastname}`,
            email: this.form_register_admin.email,
            access_role: 1 // สมมุติว่าเป็นระดับการเข้าถึงที่กำหนด
          };
          Swal.fire({
            icon: 'success',
            text: 'สมัครสมาชิกสำเร็จ',
          }).then(() => {
            this.adminAdded.emit(newAdmin); // ส่งข้อมูล admin ใหม่กลับไปยัง ManageAdminComponent
            this.onClose();
          });
        }

      },
      (error) => {
        if(error.status === 400){
          Swal.fire({
            icon: 'error',
            title: 'คำเตือน',
            text: 'เพิ่มผู้ดูแลระบบล้มเหลว! เนื่องจากพบอีเมลซ้ำ',
          });
        }
      }
    );
  }


  onClose() {
    this.dialogRef.close();

  }
}
