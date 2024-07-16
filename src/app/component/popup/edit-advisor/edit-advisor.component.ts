import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Advisor } from 'src/app/models/advisor.model';
import { AdvisorService } from 'src/app/services/advisor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-advisor',
  templateUrl: './edit-advisor.component.html',
})
export class EditAdvisorComponent {
  Selected_advisor?:Advisor
  constructor(
    public dialogRef: MatDialogRef<EditAdvisorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private advisorService: AdvisorService
  ) {
    if (this.data && this.data.advisorId) {
      this.loadAdvisorDetails(this.data.advisorId);
    }
  }

  // You can use this.data.advisorId to access the passed data
  

  loadAdvisorDetails(advisorId: number): void {
    this.advisorService.getAdvisorById(advisorId).subscribe(
      (advisor) => {
        this.Selected_advisor = advisor;
        console.log('Loaded advisor details:', advisor);
      },
      (error) => {
        console.error('Failed to load advisor details:', error);
        // Handle error
      }
    );
  }


  onNoClick(): void {
    event?.preventDefault()
    this.dialogRef.close();
  }

  EditAdvisor(advisor_id:number){
    const advisor ={
      advisor_name:this.Selected_advisor!.advisor_name
    }
    this.advisorService.EditAdvisor(advisor_id,advisor).subscribe(res=>{
      console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'Advisor Updated !'
      }).then(() => {
        this.dialogRef.close(res);
      },
      (error) => {
        console.error('Error adding advisor:', error);
        // Notify user of error
        Swal.fire({
          icon: 'error',
          title: 'Fail Update !',
          text: error.message // Display error message received from server
        });
      });
    })
  }

  // onSaveClick(): void {
  //   // Perform save operation and return result if needed
  //   const result = { /* result data */ };
  //   this.dialogRef.close(result);
  // }
}
