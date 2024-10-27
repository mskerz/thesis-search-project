import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AdminDashBoardConvert as Convert,
  AdminDashboard,
} from 'src/app/models/dashboard.model';
import { AdminService } from 'src/app/services/Admin.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  home: any;
  adminDashboard!: AdminDashboard;
  items = [{ label: 'แผงควบคุม' }, { label: 'ผู้ดูแลระบบ' }];
  lineChart: any = []; //ประกาศตัวแปรเก็บค่า

  constructor(private adminService: AdminService) {
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  ngOnInit() {
    // Mock data
    this.getDashboard();
  }

  getDashboard() {
    this.adminService.getDashboard().subscribe((data) => {
      this.adminDashboard = Convert.Json_ToAdmins(JSON.stringify(data));
      console.log(this.adminDashboard);
      // ตรวจสอบว่าข้อมูลถูกต้องและไม่เป็น null
      if (this.adminDashboard) {
        this.createChart(); // เรียกใช้ createChart() หลังจากที่ข้อมูลถูกโหลด
      }
    });
  }

  createChart() {
    const docWaitingCount = this.adminDashboard?.doc_waiting_count || 0;
    const docApprovedCount = this.adminDashboard?.doc_approved_count || 0;
    const docRejectedCount = this.adminDashboard?.doc_rejected_count || 0;
    this.lineChart = new Chart('lineChart', {
      // สร้าง object และใช้ชื่อ id lineChart ในการอ้างอิงเพื่อนำมาเเสดงผล
      type: 'bar', // ใช้ชนิดแผนภูมิแบบเส้น
      data: {
        // ข้อมูลภายในแผนภูมิแบบเส้น
        labels: [
          'เอกสารที่รอการตรวจสอบ',
          'เอกสารที่ผ่านการอนุมัติ',
          'เอกสารที่ถูกปฏิเสธ',
        ], // ชื่อของข้อมูลในแนวแกน x
        datasets: [
          {
            label: 'เอกสารที่รอการตรวจสอบ',
            data: [docWaitingCount, 0, 0], // แสดงเฉพาะข้อมูลเอกสารที่รอการตรวจสอบ
            backgroundColor: 'rgba(54, 162, 235, 0.2)', // สีน้ำเงิน
            borderColor: 'rgba(54, 162, 235, 1)', // ขอบสีน้ำเงิน
            borderWidth: 2, // ความหนาของขอบ
          },
          {
            label: 'เอกสารที่ผ่านการอนุมัติ',
            data: [0, docApprovedCount, 0], // แสดงเฉพาะข้อมูลเอกสารที่ผ่านการอนุมัติ
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // สีเขียว
            borderColor: 'rgba(75, 192, 192, 1)', // ขอบสีเขียว
            borderWidth: 2, // ความหนาของขอบ
          },
          {
            label: 'เอกสารที่ถูกปฏิเสธ',
            data: [0, 0, docRejectedCount], // แสดงเฉพาะข้อมูลเอกสารที่ถูกปฏิเสธ
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // สีแดง
            borderColor: 'rgba(255, 99, 132, 1)', // ขอบสีแดง
            borderWidth: 2, // ความหนาของขอบ
          },
        ],
      },
      options: {
        responsive: true, // ทำให้กราฟปรับขนาดอัตโนมัติ
        plugins: {
          title: {
            // ข้อความที่อยู่ด้านบนของแผนภูมิ
            display: true,
            text: 'จำนวนเอกสารแต่ละประเภท',
          },
        },
        scales: {
          // แสดง scales ของแผนภูมิเริ่มที่ 0
          y: {
            // ใช้ 'y' แทน 'yAxes'
            min: 0, // เริ่มจาก 0
            stacked: true,
            ticks: {
              // การกำหนด ticks ของแกน y
              autoSkip: true,
              maxTicksLimit: 10, // จำกัดจำนวน ticks
            },
          },
          x: {
            // สามารถตั้งค่าแกน x ได้เช่นกัน
            stacked: true,

            ticks: {
              autoSkip: true,
              maxTicksLimit: 12, // จำกัดจำนวน ticks
            },
          },
        },
      },
    });
  }
}
