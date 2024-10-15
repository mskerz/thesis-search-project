import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AddAdvisorComponent } from 'src/app/component/popup/add-advisor/add-advisor.component';
import { EditAdvisorComponent } from 'src/app/component/popup/edit-advisor/edit-advisor.component';
import { Advisor } from 'src/app/models/advisor.model';
import { AdvisorService } from 'src/app/services/advisor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-advisor',
  templateUrl: './manage-advisor.component.html',
  styleUrls: ['./manage-advisor.component.scss']
})
export class ManageAdvisorComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<Advisor>; // ใช้ ViewChild
  Advisors= Array<Advisor>();
  displayedColumns: string[] = ['advisor_id', 'advisor_name', 'actions'];
  page =1;
  rowsPerPage = 6;
  totalRecords = 0;
  paginateAdvisor = Array<Advisor>();
  constructor(private advisorService:AdvisorService,private dialog: MatDialog,private cdr: ChangeDetectorRef){

  }
  ngOnInit(){
    this.fetchAdvisors();
  }
  fetchAdvisors(){
    this.advisorService.fetchAdvisorAll().subscribe((data)=>{
        this.Advisors = data;
        this.totalRecords = data.length
        this.updatePagination()
        
    },err=>{
      console.error('Failed to fetch advisors:', err);

    });
  }

  openAddAdvisorDialog(): void {
    const dialogRef = this.dialog.open(AddAdvisorComponent, {
      width: '450px',
      disableClose: true,

    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Handle result if needed
        console.log('Dialog closed with result:', result);
        this.cdr.detectChanges();
        this.fetchAdvisors();// Detect changes after dialog closes
      }
    });

    
  }

  OpenEditAdvisorDialog(advisor_id:number): void {
    const dialogRef = this.dialog.open(EditAdvisorComponent, {
      width: '450px',
      disableClose: true,
      data: { advisorId: advisor_id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Handle result if needed
        this.cdr.detectChanges();
        this.fetchAdvisors();// Detect changes after dialog closes
        this.table.renderRows(); // ทำให้ตาราง re-render
      }
    });

    
  }

  deleteAdvisor(advisor:any): void {
    Swal.fire({
      title: `ยืนยันการลบข้อมูลอาจารย์ที่ปรึกษา `,
      // text:advisor.advisor_name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#27B758',
      cancelButtonColor: 'gray',
      cancelButtonText:"ยกเลิก",
      confirmButtonText: 'ตกลง',
    }).then((result) => {
      if (result.isConfirmed) {
        this.advisorService.deleteAdvisor(advisor.advisor_id).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'ลบข้อมูลอาจารย์ที่ปรึกษาสำเร็จ !',
            });
            this.cdr.detectChanges();
            this.table.renderRows();
                // Optionally, update UI or perform additional actions
          },
          (error) => {
            console.error('Failed to delete advisor:', error);
            // Handle error
          }
        );
      }
    });
  }

  onPageChange(event: any): void {
    this.page = event.page + 1; // PrimeNG paginator starts from 0
    this.updatePagination();
  }
  updatePagination(): void {
    const startIndex = (this.page - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.paginateAdvisor = this.Advisors.slice(startIndex, endIndex);
  }
  
}
