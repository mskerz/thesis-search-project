import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  returnUrl = ''
  form_login ={
    email :'wichasin.s@gmail.com',
    password: '12345678'
  }
  userRole: number | null = null;
  constructor( private router: Router, private authService: AuthService,        private route: ActivatedRoute,
  )  {
    
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log("returnUrl : " + this.returnUrl);
    

  }

  onSubmit() {
     
    if(!this.form_login){
      Swal.fire({
        icon:'warning',
        title:'กรุณากรอกข้อมูลให้ครบ!'
      })
      return;
    }
    this.authService.login(this.form_login).subscribe(
      response => {
        // Handle successful login
        console.log(response.status_code);
        Swal.fire({
          icon:'success',
          title:'เข้าสู่ระบบสำเร็จ'
        }).then(()=>{
          this.authService.getUserRole().subscribe(role => {
            this.userRole = role;
          });
          if(this.userRole ==1){
            this.router.navigate(['/account/admin/dashboard']);
          }else{
            this.router.navigateByUrl(this.returnUrl);
          }
          
        })
        
      },
      error => {
        // Handle login error
        if(error.status==404){
          Swal.fire({
            icon:'error',
            title:'ไม่สามารถเข้าสู่ระบบได้',
            text: 'ไม่พบข้อมูลผู้ใช้นี้ในระบบ'
          })
        }
        if(error.status==400){
          Swal.fire({
            icon:'error',
            title:'ไม่สามารถเข้าสู่ระบบได้',
            text: 'รหัสผ่านคุณไม่ถูกต้อง'
          })
        }

        
      }
    );
  }

}
