import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-forgot-password-send-email',
  templateUrl: './forgot-password-send-email.component.html',
  styleUrls: ['./forgot-password-send-email.component.scss']
})
export class ForgotPasswordSendEmailComponent {
  emailForm: FormGroup;

constructor(private authService: AuthService,private fb: FormBuilder,private route:Router){
  this.emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]]
  });
}

onSubmit() {
  if (!this.emailForm.value.email) {
    Swal.fire({
      icon: 'warning',
      title: 'คุณยังไม่ได้กรอกอีเมล!'
    });
  }  
  if(this.emailForm.invalid){
    return;
  }

  console.log(this.emailForm.value.email);
  this.authService.sendEmail(this.emailForm.value.email).subscribe(res=>{
    if(res.status_code ==200){
      Swal.fire({
        icon: 'success',
        title:'ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลของคุณแล้ว ! '
      }).then(()=>{
        this.route.navigate(['/login']); 
      })
    }

  },err=>{
    
    if(err.status == 404){
      Swal.fire({
        icon: 'warning',
        title: 'ไม่พบอีเมลนี้ในระบบ!'
      });
    }
    return;
  })
}
}
