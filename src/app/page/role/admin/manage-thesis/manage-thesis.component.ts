import { ChangeDetectorRef, Component,  OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EditThesisComponent } from 'src/app/component/popup/edit-thesis/edit-thesis.component';
import { ThesisUploadList } from 'src/app/models/ThesisUpload.model';
import { DownloadService } from 'src/app/services/download.service';
import { ThesisService } from 'src/app/services/thesis.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-thesis',
  templateUrl: './manage-thesis.component.html',
  styleUrls: ['./manage-thesis.component.scss'],
})
export class ManageThesisComponent implements OnInit {
  ThesisUploadList = Array<ThesisUploadList>();
  displayedColumns: string[] = [
    'idx',
    'title_th',
    'author_name',
    'advisor_name',
    'recheck_status',
    'file_name',
    'manage_thesis'
  ];
  isEditing: { [docId: number]: boolean } = {}; // เปลี่ยนเป็น object ที่มีคีย์เป็น number

  rowsPerPage = 8;
  totalRecords = 0;
  paginatedData = Array<ThesisUploadList>();
  currentPage = 1;
  isDropdownDisabled = false;
  isLoading: boolean = false; // สร้างตัวแปรสถานะสำหรับ spinner
  statusOptions = [
    { label: 'Wait', value: 0 },
    { label: 'Approved', value: 1 },
    { label: 'Rejected', value: 2 },
  ];
  constructor(
    private thesisService: ThesisService,
    private file: DownloadService,
    private dialog: MatDialog,
    private router: Router,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.Fetch();
    
  }

  Fetch() {
    this.thesisService.getThesess().subscribe(
      (data) => {
        this.ThesisUploadList = data;
        this.totalRecords = data.length;
        this.updatePagination();
      },
      (err) => {
        console.error('Error fetching thesis documents', err);
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
    this.paginatedData = this.ThesisUploadList.slice(startIndex, endIndex);
  }

  // // Define the alert method
  // alert(fileName: string): void {
  //   window.alert(fileName); // Use the browser's alert function
  // }

  OpenPreview(doc_id: number | undefined) {
    this.file.downloadPDF(doc_id!).subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        window.open(url);
      },
      (error) => {
        Swal.fire({
          icon:'error',
          title:'ข้อผิดพลาด',
          text:'ไม่สามารถเปิดไฟล์ได้ เนื่องจากไฟล์นี้อาจไม่มีอยู่'
        })
        console.error('Error downloading PDF:', error);
        // จัดการเมื่อเกิดข้อผิดพลาด
      }
    );
  }

  check(status: number): string | undefined {
    // ค้นหาสิ่งที่มีค่า `value` ตรงกับ `status`
    const option = this.statusOptions.find((option) => option.value === status);

    // คืนค่า label ของตัวเลือกที่ตรงกัน หรือ undefined ถ้าไม่พบ
    return option ? option.label : undefined;
  }

  openLinkInNewTab(url: string) {
    const fullUrl = this.router.serializeUrl(this.router.createUrlTree([url]));
    window.open(fullUrl, '_blank');
  }

  toggleEdit(docId: number): void {
    // Set all others to false
    Object.keys(this.isEditing).forEach((id) => {
      if (+id !== docId) this.isEditing[+id] = false;
    });

    // Toggle the specific document
    this.isEditing[docId] = !this.isEditing[docId];
  }

  onDropdownChange(docId: number): void {
    console.log(this.isEditing[docId]);
    // อัปเดตหรือจัดการสถานะอื่น ๆ ตามที่คุณต้องการ
  }

  canEditStatus(status: number): boolean {
    // Allow edit only if status is "Wait" (0)
    return status === 0;
  }

  ConfirmRecheck(docId: number, newStatus: number) {
    // เก็บสถานะเดิมไว้ก่อน

    Swal.fire({
      text: 'ยืนยันการตรวจสอบเอกสาร',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#27B758',
      cancelButtonColor: 'gray',
      cancelButtonText:"ยกเลิก",
      confirmButtonText: 'ตกลง',
    }).then((result) => {
      if (result.isConfirmed) {
        this.Recheck(docId, newStatus);
        // ปิดโหมดการแก้ไข
        this.isEditing[docId] = false;
      } else if (result.isDismissed) {
        const document = this.paginatedData.find((doc) => doc.doc_id === docId);
        if (document) {
          document.recheck_status = 0;
        }
        this.isEditing[docId] = false;
      }
    });
  }

  Loading() {
    // แสดง popup กำลังโหลด
    return Swal.fire({
      title: 'กำลังทำดัชนีเอกสาร',
      html: `
      <div class="spinner-border text-success" role="status">
                <span class="sr-only"></span>
      </div>
    `,
      showConfirmButton: false,
      showCancelButton: false,
      allowOutsideClick: false, // ป้องกันไม่ให้ผู้ใช้ปิด popup
    
    });
  }

  Recheck(docId: number, newStatus: number) {
    // this.Loading();
    this.thesisService.Recheck(docId, newStatus).subscribe(
      (response) => {
        // Swal.close();
        if (response.status === 200) {
          if (newStatus === 1) {
            Swal.fire({
              title: 'Approved !',
              text: 'อัปเดตสถานะเอกสารสำเร็จ',
              icon: 'success',
            });
          } else if (newStatus === 2) {
            Swal.fire({
              title: 'Rejected !',
              text: 'อัปเดตสถานะเอกสารสำเร็จ',
              icon: 'warning',
            });
          }
        }
        // อัปเดตสถานะในรายการหลังจากเรียก API สำเร็จ

        // เรียก Fetch() เพื่ออัปเดตข้อมูลล่าสุด
        this.Fetch();
      },
      (error) => {
        Swal.close(); // ปิด popup
        console.error('Error updating status:', error);
        Swal.fire({
          text: 'เกิดข้อผิดพลาดในการอัปเดตสถานะเอกสาร',
          icon: 'error',
        });
      }
    );
  }

  getSeverity(status: number) {
    switch (status) {
      case 1:
        return 'success';
      case 2:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  filteredOptions(): any[] {
    // Filter out "Wait" status options if needed
    return this.statusOptions.filter((option) => option.value !== 0);
  }
  
  
  OpenThesisEditDialog(doc_id:number){
    const dialogRef = this.dialog.open(EditThesisComponent,{
      width:'800px',
      data:{ docId: doc_id },
      disableClose:true
    }) 


    dialogRef.componentInstance.thesisUpdate.subscribe((update)=>{
      const index = this.ThesisUploadList.findIndex(thesis => thesis.doc_id === update.doc_id);
      if (index !== -1) {
        
        this.ThesisUploadList[index] = {
          ...this.ThesisUploadList[index],
          title_th:update.title_th,
          advisor_name: update.advisor_name
        } // อัปเดตข้อมูลอาจารย์ที่ปรึกษาในอาเรย์
            console.log('Updated advisor:', this.ThesisUploadList[index].advisor_name); // ตรวจสอบค่าที่อัปเดต

        this.updatePagination(); // เรียกใช้ฟังก์ชันเพื่อตรวจสอบการแบ่งหน้า
      }
    })
  }


  deleteThesis(doc_id:number){
    Swal.fire({
      text: 'ยืนยันการลบปริญญานิพนธ์',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#27B758',
      cancelButtonColor: 'gray',
      cancelButtonText:"ยกเลิก",
      confirmButtonText: 'ตกลง',
    }).then((res)=>{
      if(res.isConfirmed){
        this.thesisService.deleteThesis(doc_id).subscribe(res=>{
          Swal.fire({
            icon:'success',
            title:'ลบปริญญานิพนธ์นี้เรียบร้อยแล้ว'
          })
          this.ThesisUploadList = this.ThesisUploadList.filter(
            (thesis) => thesis.doc_id !== doc_id
          )
          this.totalRecords = this.ThesisUploadList.length; // อัปเดตจำนวนรวมของผู้ดูแลระบบ
          this.updatePagination();
      },(err)=>{
        console.error("Error with Delete Fail: " + err);
        Swal.fire({
          icon:'warning',
          title:'ไม่สามารถลบปริญญานิพนธ์ได้'
        })
        
      });
      }

    })
      
  }
}



