import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent  {
  form_register ={
    email :'',
    password: '',
    confirm_password: '',
    firstname: '',
    lastname: '',
  }
  showHidePassword = false
  showHideConfirmPassword = false

  constructor(private authService: AuthService,private router:Router){}

  toggleHidePassword() {
    this.showHidePassword = !this.showHidePassword;

  }
  toggleHideConfirmPassword() {
    this.showHideConfirmPassword = !this.showHideConfirmPassword;
  }

  onSubmit() {
    if (!this.form_register.email || !this.form_register.password || 
      !this.form_register.confirm_password || !this.form_register.firstname || 
      !this.form_register.lastname) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'กรุณากรอกข้อมูลให้ครบ!',
    });
    return;
  }

    if (this.form_register.password != this.form_register.confirm_password) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน!',
      });
      return;
    }

    const data={
      email:this.form_register.email,
      password:this.form_register.password,
      firstname:this.form_register.firstname,
      lastname:this.form_register.lastname
      
    }
    this.authService.Register(data).subscribe(
      (res) => {
        if(res.status_code === 200) {
          Swal.fire({
            icon: 'success',
            text: 'สมัครสมาชิกสำเร็จ',
          }).then(() => {
            this.router.navigate(['/login']);
          });
        }

      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Registration failed!',
        });
      }
    );
  }
}
