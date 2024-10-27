// src/app/models/admin-dashboard.model.ts

export interface AdminDashboard {
    student_count: number;      // จำนวนผู้ใช้ที่เป็นนักศึกษา
    alumni_count: number;       // จำนวนผู้ใช้ที่เป็นศิษย์เก่า
    admin_count: number;        // จำนวนผู้ใช้ที่เป็นแอดมิน
    doc_waiting_count: number;  // จำนวนเอกสารที่รอการตรวจสอบ
    doc_approved_count: number; // จำนวนเอกสารที่อนุมัติแล้ว
    doc_rejected_count: number; // จำนวนเอกสารที่ถูกปฏิเสธ
    doc_count:number; //
    advisor_count: number; // 

  }
  

  export class AdminDashBoardConvert {
    public static Json_ToAdmins(json: string): AdminDashboard{
        return JSON.parse(json);
    }

     
}