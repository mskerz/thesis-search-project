import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  form_login ={
    email :'wichasin.s@gmail.com',
    password: '12345678'
  }
  constructor( private router: Router, private authService: AuthService) {
  
  }


  onSubmit() {
    if(!this.form_login){
      Swal.fire('กรุณากรอกข้อมูลให้ครบ!')
      return;
    }
    this.authService.login(this.form_login).subscribe(
      response => {
        // Handle successful login
        console.log(response.status_code);
        
        this.router.navigate(['/simple-search']);
      },
      error => {
        // Handle login error
        if(error.status==404){
          Swal.fire('Login is Empty or Invalid')
        }

        
      }
    );
  }

}
