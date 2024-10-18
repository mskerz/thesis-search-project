import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  home: any;
  items = [
    { label: 'แผงควบคุม' },
    { label: 'ผู้ดูแลระบบ' }

]

  constructor() {
 
    
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  ngOnInit() {
    // Mock data
   
  }
}