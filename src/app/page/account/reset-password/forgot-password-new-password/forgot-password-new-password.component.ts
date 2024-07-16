import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password-new-password',
  templateUrl: './forgot-password-new-password.component.html',
  styleUrls: ['./forgot-password-new-password.component.scss']
})
export class ForgotPasswordNewPasswordComponent implements OnInit {
  showPasswordInput = false;
  showConfirmPasswordInput = false;
  resetPassword ='';
  confirmResetPassword = '';

  reset_token = ''
  constructor(private route: ActivatedRoute,private router: Router,private authService: AuthService){
    
  }

  ngOnInit(): void {
    // Retrieve the reset token from the URL
    this.route.queryParams.subscribe(params => {
      this.reset_token = params['reset_token'];
      console.log(this.reset_token); // Display the reset token in the console
    });
  }
  togglePasswordVisibility(input: HTMLInputElement, inputType: string) {
    if (inputType === 'password') {
      this.showPasswordInput = !this.showPasswordInput;
      input.type = this.showPasswordInput ? 'text' : 'password';
    } else if (inputType === 'confirmPassword') {
      this.showConfirmPasswordInput = !this.showConfirmPasswordInput;
      input.type = this.showConfirmPasswordInput ? 'text' : 'password';
    }
  }
  

  onSubmit(){
    if(!(this.resetPassword && this.confirmResetPassword)){
      Swal.fire({
        icon:'warning',
        title:'กรุณากรอกข้อมูลรหัสผ่าน',
      })
    }
    if(this.confirmResetPassword != this.resetPassword){
      Swal.fire({
        icon:'warning',
        title:'ยืนยันรหัสผ่านไม่ตรงกัน'
      })

     

    }
    var data ={
      token : this.reset_token,
      new_password:this.resetPassword
    }

    this.authService.ResetPassword(data).subscribe(res=>{
      if(res.status ==200){
        Swal.fire({
          icon:'success',
          title:res.message,
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/login']);
          }
        });
      }
    },err=>{
      if (err.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'ข้อผิดพลาด',
          text: 'โทเค็นนี้อาจหมดอายุ หรือมีการถูกใช้งานแล้ว'
        });
      }
    })
  }
}
