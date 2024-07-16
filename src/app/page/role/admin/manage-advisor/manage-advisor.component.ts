import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  Advisors= Array<Advisor>();
  displayedColumns: string[] = ['advisor_id', 'advisor_name', 'actions'];
  page =1;
  constructor(private advisorService:AdvisorService,private dialog: MatDialog,private cdr: ChangeDetectorRef){

  }
  ngOnInit(){
    this.fetchAdvisors();
  }
  fetchAdvisors(){
    this.advisorService.fetchAdvisorAll().subscribe((data)=>{
        this.Advisors = data;
        this.cdr.detectChanges();
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
        console.log('Dialog closed with result:', result);
        this.fetchAdvisors();// Detect changes after dialog closes
      }
    });

    
  }

  deleteAdvisor(advisor_id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this advisor!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.advisorService.deleteAdvisor(advisor_id).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Advisor Deleted!',
            });
            this.fetchAdvisors();
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
  
}
