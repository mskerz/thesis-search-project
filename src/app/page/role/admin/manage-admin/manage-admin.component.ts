import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminAddComponent } from 'src/app/component/popup/admin-add/admin-add.component';
import { Admin, AdminListConvert } from 'src/app/models/admin.model';
import { Student } from 'src/app/models/student.model';
import { AdminService } from 'src/app/services/Admin.service';
import { StudentService } from 'src/app/services/Student.service';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-manage-admin',
  templateUrl: './manage-admin.component.html',
  styleUrls: ['./manage-admin.component.scss'],
})
export class ManageAdminComponent implements OnInit {
  AdminList = Array<Admin>();
  rowsPerPage = 6;
  totalRecords = 0;
  paginatedData = Array<Admin>();
  currentPage = 1;
  isDropdownDisabled = false;
  displayedColumns: string[] = ['idx', 'fullname', 'email', 'management'];
  isEditing: { [user_id: number]: boolean } = {}; // เปลี่ยนเป็น object ที่มีคีย์เป็น number

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAdminUser();
  }

  loadAdminUser(): void {
    this.adminService.getAdminAll().subscribe(
      (data) => {
        this.AdminList = AdminListConvert.Json_ToAdmins(JSON.stringify(data));
        this.totalRecords = data.length;
        console.log(this.AdminList);
        this.updatePagination();
      },
      (error) => {
        console.error('Error loading admin:', error);
      }
    );
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG paginator starts from 0
    this.updatePagination();
  }
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.paginatedData = this.AdminList.slice(startIndex, endIndex);
  }

  // // Method to update the student's role
  // updateStatus(user_id: number,role:number): void {
  //   this.stdService.changeStudentRole(user_id,role).subscribe(
  //     response => {
  //       if (response.status_code === 200) {
  //         Swal.fire({
  //           text: 'เปลี่ยนสถานะสำเร็จ!',
  //           icon: 'success',
  //           confirmButtonText: 'ตกลง'
  //         });
  //         // Optionally refresh the student list to reflect the change
  //         this.loadAdminUser();
  //       } else {
  //         Swal.fire({
  //           text: 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ',
  //           icon: 'error',
  //           confirmButtonText: 'ตกลง'
  //         });
  //       }
  //     },
  //     error => {
  //       Swal.fire({
  //         text: 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ',
  //         icon: 'error',
  //         confirmButtonText: 'ตกลง'
  //       });
  //     }
  //   );
  // }

  openAddadminDialog(): void {
    const dialogRef = this.dialog.open(AdminAddComponent, {
      width: '780px',
      height: '480px',
    });

    dialogRef.componentInstance.adminAdded.subscribe((newAdmin) => {
      // window.location.reload();
      const updatedAdminList = [...this.AdminList];
      // คำนวณ idx ใหม่โดยการเพิ่ม 1 ให้กับค่าที่มากที่สุดใน AdminList
      const maxIdx =
        updatedAdminList.length > 0
          ? Math.max(...updatedAdminList.map((admin) => admin.idx))
          : 0;
      newAdmin.idx = maxIdx + 1; // ตั้งค่า idx ใหม่
      // เพิ่ม admin ใหม่ไปยัง AdminList
      updatedAdminList.push(newAdmin);
      this.AdminList = updatedAdminList; // อัปเดต AdminList
      this.totalRecords = this.AdminList.length; // อัปเดตจำนวนรวมของผู้ดูแลระบบ
      this.updatePagination(); // อัปเดตการแบ่งหน้า
    });
  }

  Delete(adminId: number) {
    // แสดงกล่องยืนยันก่อนทำการลบ
    Swal.fire({
      title: 'ยืนยันการลบข้อมูลผู้ดูแลระบบนี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#27B758',
      cancelButtonColor: 'gray',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ตกลง',
    }).then((result) => {
      // หากผู้ใช้ยืนยันการลบ
      if (result.isConfirmed) {
        this.adminService.deleteAdmin(adminId).subscribe(
          (res: any) => {
            if (res.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'ลบผู้ดูแลระบบสำเร็จ',
              });
              // อัปเดต AdminList โดยการกรองข้อมูล
              this.AdminList = this.AdminList.filter(
                (admin) => admin.user_id !== adminId
              );
              this.totalRecords = this.AdminList.length; // อัปเดตจำนวนรวมของผู้ดูแลระบบ
              this.updatePagination();
            }
          },
          (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาด',
              text: 'ไม่สามารถลบผู้ดูแลระบบได้',
            });
          }
        );
      }
    });
  }
}
