import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/models/student.model';
import { StudentService } from 'src/app/services/Student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-student',
  templateUrl: './manage-student.component.html',
  styleUrls: ['./manage-student.component.scss']
})
export class ManageStudentComponent implements OnInit  {

  StudentList = Array<Student>();
  rowsPerPage =6;
  totalRecords = 0;
  paginatedData = Array<Student>()
  currentPage = 1;
  isDropdownDisabled = false;
  displayedColumns: string[] = ['idx', 'author_name', 'email', 'access_role'];
  isEditing: { [user_id: number]: boolean } = {}; // เปลี่ยนเป็น object ที่มีคีย์เป็น number


  roleOption =[
    { label: 'นิสิต', value: 0 },
    { label: 'ศิษย์เก่า', value: 2 },
  ];
  constructor(private stdService:StudentService) {
    
  }

  ngOnInit()  {
      this.loadStudents()
  }

  loadStudents(): void {
    this.stdService.getStudent().subscribe(data => {
      this.StudentList = data;
      this.totalRecords = data.length;
      console.log(this.StudentList);
      this.updatePagination();
    }, error => {
      console.error('Error loading students:', error);
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG paginator starts from 0
    this.updatePagination();
  }
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.paginatedData = this.StudentList.slice(startIndex, endIndex);
  }
  getSeverity(role: number) {
    switch (role) {
        case 1:
            return 'success';
        case 2: return 'warning';
        default:
            return 'info';
    }
  }

  canEditStatus(status: number): boolean {
    // Allow edit only if status is "Wait" (0)
    return status === 0;
  }

  check(accessRole: number): string | undefined {
    // Find the role option with the matching accessRole
    const option = this.roleOption.find(option => option.value === accessRole);
    
    // Return the label of the matching role option or undefined if not found
    return option ? option.label : undefined;
  }

  toggleEdit(userId: number): void {
    // Set all others to false
    Object.keys(this.isEditing).forEach(id => {
      if (+id !== userId) this.isEditing[+id] = false;
    });
  
    // Toggle the specific student
    this.isEditing[userId] = !this.isEditing[userId];
  }
  // Method to update the student's role
  updateStatus(user_id: number,role:number): void {
    this.stdService.changeStudentRole(user_id,role).subscribe(
      response => {
        if (response.status_code === 200) {
          Swal.fire({
            text: 'เปลี่ยนสถานะสำเร็จ!',
            icon: 'success',
            confirmButtonText: 'ตกลง'
          });
          // Optionally refresh the student list to reflect the change
          this.loadStudents();
        } else {
          Swal.fire({
            text: 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ',
            icon: 'error',
            confirmButtonText: 'ตกลง'
          });
        }
      },
      error => {
        Swal.fire({
          text: 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ',
          icon: 'error',
          confirmButtonText: 'ตกลง'
        });
      }
    );
  }

  ConfirmRecheck(user_id:number,role:number){
    Swal.fire({
      text:"ยืนยันการเปลี่ยนสิทธิ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#27B758',
      cancelButtonColor: 'gray',
      cancelButtonText:"ยกเลิก",
      confirmButtonText: 'ตกลง',
    }).then((result)=>{
      if(result.isConfirmed ){
        this.updateStatus(user_id,role);
        this.isEditing[user_id] = false;
      }
      
    })
  }

}
