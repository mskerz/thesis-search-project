import { Component, OnInit } from '@angular/core';
import { Admin,AdminListConvert } from 'src/app/models/admin.model';
import { Student } from 'src/app/models/student.model';
import { AdminService } from 'src/app/services/Admin.service';
import { StudentService } from 'src/app/services/Student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-admin',
  templateUrl: './manage-admin.component.html',
  styleUrls: ['./manage-admin.component.scss']
})
export class ManageAdminComponent implements OnInit  {
  AdminList = Array<Admin>();
  rowsPerPage =6;
  totalRecords = 0;
  paginatedData = Array<Admin>()
  currentPage = 1;
  isDropdownDisabled = false;
  displayedColumns: string[] = ['idx', 'fullname', 'email','management'];
  isEditing: { [user_id: number]: boolean } = {}; // เปลี่ยนเป็น object ที่มีคีย์เป็น number



  constructor(private adminService:AdminService) {
    
  }

  ngOnInit()  {
      this.loadAdminUser()
  }

  loadAdminUser(): void {
    this.adminService.getAdminAll().subscribe(data => {
      this.AdminList = AdminListConvert.Json_ToAdmins(JSON.stringify(data)) ;
      this.totalRecords = data.length;
      console.log(this.AdminList);
      this.updatePagination();
    }, error => {
      console.error('Error loading admin:', error);
    });
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

   

}
