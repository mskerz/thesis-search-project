import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // เพิ่ม FormBuilder และ FormGroup
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  showCurrentPassword = false;
  showPasswordInput = false;
  showConfirmPasswordInput = false;
  changePasswordForm: FormGroup; // เพิ่มตัวแปรสำหรับเก็บ FormGroup

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    // สร้าง FormGroup ใน constructor
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required] // แก้ชื่อ control เป็น confirmNewPassword
    });
  }

  togglePasswordVisibility(input: HTMLInputElement, inputType: string) {
    if (inputType === 'password') {
      this.showPasswordInput = !this.showPasswordInput;
      input.type = this.showPasswordInput ? 'text' : 'password';
    } else if (inputType === 'confirmPassword') {
      this.showConfirmPasswordInput = !this.showConfirmPasswordInput;
      input.type = this.showConfirmPasswordInput ? 'text' : 'password';
    }else if(inputType ==='CurrentPassword'){
      this.showCurrentPassword =!this.showCurrentPassword;
      input.type = this.showCurrentPassword ? 'text' : 'password';
    }
  }

  onSubmit() {
    // ตรวจสอบความถูกต้องของฟอร์มก่อนที่จะทำการส่งข้อมูลไปยัง API
    if (this.changePasswordForm.valid) {
      const new_password = this.changePasswordForm.get('newPassword')!.value;
      const confirm_new_password = this.changePasswordForm.get('confirmNewPassword')!.value;

      if (new_password !== confirm_new_password) {
        Swal.fire({
          icon: 'error',
          title: 'รหัสผ่านไม่ตรงกัน',
          text: 'กรุณากรอกรหัสผ่านใหม่และยืนยันรหัสผ่านใหม่ให้ตรงกัน'
        });
        return; // หยุดการทำงานฟังก์ชันถ้ารหัสผ่านไม่ตรงกัน
      }

      // สร้างข้อมูลที่จะส่งไปยัง API
      const change_password_data = {
        current_password: this.changePasswordForm.get('currentPassword')!.value,
        new_password: new_password // ใช้ new_password ที่ตรงกับ confirm_new_password
      };

      // เรียกใช้งาน API เปลี่ยนรหัสผ่าน
      this.authService.changePassword(change_password_data).subscribe(
        res => {
          if (res.status_code === 200) {
            Swal.fire({
              icon: 'success',
              title: 'แจ้งเตือน',
              text: res.message,
              confirmButtonText: 'ตกลง'
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/simple-search']);
              }
            });
          }
        },
        err => {
          if (err.status === 400) {
            Swal.fire({
              icon: 'error',
              title: 'ข้อผิดพลาด',
              text: 'รหัสผ่านปัจจุบันไม่ถูกต้อง'
            });
          }
        }
      );
    }
  }
}
