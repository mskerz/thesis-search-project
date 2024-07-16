import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit  {
  loggedIn: Observable<boolean>;
  userRole: number | null = null;
  currentUser: User | null = null;

  constructor(private authService: AuthService){
    this.loggedIn = this.authService.isLoggedIn();
    this.authService.verifyUser();
    
    
  }

  ngOnInit(){
    
   
    
    this.authService.getCurrentUser().subscribe(user=>{
      this.currentUser = user
      
    });
    this.authService.getUserRole().subscribe(role => {
      this.userRole = role;
    });
  }


  logout() {
    this.authService.logout();
    sessionStorage.removeItem('thesisList')
  }
} 
