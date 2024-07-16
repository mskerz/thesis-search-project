import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AdvisorService } from 'src/app/services/advisor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-advisor',
  templateUrl: './add-advisor.component.html',
  styleUrls: ['./add-advisor.component.scss']
})
export class AddAdvisorComponent {
  advisor={
    advisor_name:''
  }
  constructor(public dialogRef: MatDialogRef<AddAdvisorComponent>,private advisorService: AdvisorService){}
  onNoClick(): void {
    event?.preventDefault()
    this.dialogRef.close();
  }

  newAdvisor(){
    if (!this.advisor.advisor_name) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Fill Advisor Name!'
      });
      return;
    }


    // Call AdvisorService to insert advisor
    this.advisorService.insertAdvisor(this.advisor).subscribe(
      (response:any) => {
        console.log('New advisor added:', response);
        // Optionally, notify user of success
        if(response.status_code === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Advisor added successfully!'
          }).then(() => {
            this.dialogRef.close(response);
          });
        }

        // Close the dialog after successful addition
        
      },
      (error) => {
        console.error('Error adding advisor:', error);
        // Notify user of error
        Swal.fire({
          icon: 'error',
          title: 'Error adding advisor',
          text: error.message // Display error message received from server
        });
      }
    );
  }
}
