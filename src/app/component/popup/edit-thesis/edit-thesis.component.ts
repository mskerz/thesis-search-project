import { Component, EventEmitter, Inject, NgZone, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Advisor, Convert as AdvisorConvert } from 'src/app/models/advisor.model';
import { ThesisEdit } from 'src/app/models/thesisEdit.model';
import { AdvisorService } from 'src/app/services/advisor.service';
import { ThesisService } from 'src/app/services/thesis.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-thesis',
  templateUrl: './edit-thesis.component.html',
  styleUrls: ['./edit-thesis.component.scss'],
})
export class EditThesisComponent implements OnInit {
  @Output() thesisUpdate = new EventEmitter<any>(); // สร้าง EventEmitter

  Advisors = Array<Advisor>();
  selected_thesis?: ThesisEdit;
  constructor(
    private advisor: AdvisorService,
    public dialogRef: MatDialogRef<EditThesisComponent>,
    private thesisService: ThesisService,
    
    private ngZone: NgZone, // นำเข้า NgZone

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit() {
    this.advisorFetch();
    
    
    if(this.data && this.data.docId){
      this.loadThesisforEdit(this.data.docId);
    }
  }
  loadThesisforEdit(doc_id:number){
    this.thesisService.getThesisEditByID(doc_id).subscribe((thesis)=>{
        
        this.selected_thesis =  thesis

    },
    (error) => {
      console.error('Failed to load thesis details:', error);
      // Handle error
    }
    );
  }
  advisorFetch() {
    this.advisor.fetchAdvisorAll().subscribe(
      (data) => {
        this.Advisors = AdvisorConvert.fromJson_toAdvisor(JSON.stringify(data)) ;
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  // ฟังก์ชันตรวจสอบค่าว่าง
  isEmptyField(thesis: any): boolean {
    return (
      !thesis.title_th || !thesis.title_en || !thesis.advisor_id || !thesis.year
    );
  }
  onEdit(doc_id:number) {
    // เรียกใช้ฟังก์ชันตรวจสอบค่าว่าง
    
    const ThesisEdit = {
      title_th: this.selected_thesis!.title_th,
      title_en: this.selected_thesis!.title_en,
      advisor_id: this.selected_thesis!.advisor_id,
      year: this.selected_thesis!.year,
    };
    if (this.isEmptyField(ThesisEdit)) {
      Swal.fire({
        icon: 'warning',
        title: 'เกิดข้อผิดพลาด',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      });
      event?.preventDefault();
      return;
    }
    this.thesisService
      .editThesis(ThesisEdit, doc_id)
      .subscribe((res) => {
         
        
        const update ={
          doc_id:this.selected_thesis!.doc_id,
          title_th: this.selected_thesis!.title_th,
          advisor_name:   this.selected_thesis!.advisor_name,
        }
        console.log(update);
        
        if (res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'อัปเดตข้อมูลปริญญานิพนธ์สำเร็จ !!',
          }).then(() => {
            this.thesisUpdate.emit(update)
            this.onClose();
          });
        }
      });
  }
  onClose() {
    this.dialogRef.close();

  }
}
