import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-info',
  templateUrl: './change-info.component.html',
  styleUrls: ['./change-info.component.scss']
})
export class ChangeInfoComponent {
  info ={
    email: '',
    firstname: '',
    lastname: '',
  }

  constructor(private authService:AuthService,private router:Router){
    
    this.authService.getCurrentUser().subscribe(user=>{
      this.info.email = user?.email ||''
      this.info.firstname = user?.firstname||''
      this.info.lastname = user?.lastname||''
      
    },err=>{
      console.log(err);
      
    });
  }

  onSubmit(){
    this.authService.changeProfile(this.info).subscribe(res=>{
      if(res.status_code === 200){
        console.log(res.message);
        Swal.fire({
          icon:'success',
          title:'แจ้งเตือน',
          text:res.message,
          confirmButtonText:'ตกลง'
        }
        ).then((res=>{
          if(res.isConfirmed){
            this.router.navigate(['/simple-search'])
          }
        })
        )
        
      }
    },err=>{
      if(err.status ===400){
        // alert("ERR X อีเมลนี้มีผู้ใช้งานแล้ว X")
        Swal.fire({
          icon: 'error',
          title: 'เเจ้งเตือน',
          text: "อีเมลนี้มีการลงทะเบียนแล้ว !"
        });
      }
    });
  }

}
