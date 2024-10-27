import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AdvisorService } from 'src/app/services/advisor.service';
import Swal from 'sweetalert2';
import { faker } from '@faker-js/faker';

@Component({
  selector: 'app-add-advisor',
  templateUrl: './add-advisor.component.html',
  styleUrls: ['./add-advisor.component.scss']
})
export class AddAdvisorComponent {
  @Output() advisorNew = new EventEmitter<any>();
  advisor={
    advisor_name:this.advisorService.generateFakeAdvisor()
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
        title: 'กรุณากรอกข้อมูลอาจารย์ที่ปรึกษา'
      });
      return;
    } 


    // Call AdvisorService to insert advisor
    this.advisorService.insertAdvisor(this.advisor).subscribe(
      (response:any) => {
        console.log('New advisor added:', response);
        // Optionally, notify user of success
        if(response.status_code === 200) {
          const newAdvisor = {
            advisor_id:response.new_advisorId, // รับ advisor_id จาก response
            advisor_name:this.advisor.advisor_name
          }

          Swal.fire({
            icon: 'success',
            title: 'เพิ่มข้อมูลอาจารย์ที่ปรึกษาสำเร็จ!'
          }).then(() => {
            this.advisorNew.emit(newAdvisor);
            this.dialogRef.close();
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
