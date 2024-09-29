import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './page/root/root.component';
import { SimpleSearchComponent as SimpleSearch} from './page/simple-search/simple-search.component';
import { AdvanceSearchComponent as AdvanceSearch } from './page/advance-search/advance-search.component';
import { LoginComponent } from './page/account/login/login.component';
import { RegisterComponent } from './page/account/register/register.component';
import { ChangePasswordComponent } from './page/account/change-password/change-password.component';
import { ChangeInfoComponent } from './page/account/change-info/change-info.component';
import { ThesisDecriptionComponent } from './page/thesis-decription/thesis-decription.component';
import { ImportThesisComponent } from './page/role/student/import-thesis/import-thesis.component';
import { ForgotPasswordSendEmailComponent } from './page/account/reset-password/forgot-password-send-email/forgot-password-send-email.component';
import { ForgotPasswordSendTokenComponent } from './page/account/reset-password/forgot-password-send-token/forgot-password-send-token.component';
import { ForgotPasswordNewPasswordComponent } from './page/account/reset-password/forgot-password-new-password/forgot-password-new-password.component';
import { AuthGuard } from './guard/auth-guard.guard';
import { ManageAdvisorComponent } from './page/role/admin/manage-advisor/manage-advisor.component';
import { ManageThesisComponent } from './page/role/admin/manage-thesis/manage-thesis.component';
import { ManageStudentComponent } from './page/role/admin/manage-student/manage-student.component';
import { MyThesisComponent } from './page/my-thesis/my-thesis.component';
const routes: Routes = [
  {path :'',component:RootComponent,children:[
    {path:'',component:SimpleSearch},
    {path:'simple-search',component:SimpleSearch,title:'ค้นหาแบบง่าย'},
    {path: 'advance-search',component:AdvanceSearch,title:'ค้นหาแบบขั้นสูง'},
    {path:'simple-search',component:SimpleSearch,title:'ค้นหาแบบง่าย'},
    {path: 'advance-search',component:AdvanceSearch,title:'ค้นหาแบบขั้นสูง'},
    {path: 'decription/thesis/:doc_id',component:ThesisDecriptionComponent,title:'รายละเอียดของปริญญานิพนธ์'},
    {path: 'login',component:LoginComponent,title: 'เข้าสู่ระบบ'},
    {path: 'register',component:RegisterComponent,title:'สมัครสมาชิก'},
    {path:'account/change-password',component:ChangePasswordComponent,canActivate:[AuthGuard]},
    {path: 'accoount/change-info',component:ChangeInfoComponent,title:'เปลี่ยนข้อมูลส่วนตัว',canActivate:[AuthGuard]},
    {path:'account/student/import-thesis',component:ImportThesisComponent,title:'นำเข้าปริญญานิพนธ์'},
    {path:'account/student/thesis',component:MyThesisComponent,title:'ปริญญานิพนธ์ของฉัน'},
    {path:'forgot-password',component:ForgotPasswordSendEmailComponent,title:'ลืมรหัสผ่าน'},
    {path:'send-token',component:ForgotPasswordSendTokenComponent,title:'รหัสยืนยัน'},
    {path:'reset-password', component:ForgotPasswordNewPasswordComponent,title:'ตั้งรหัสผ่านใหม่',canActivate: [AuthGuard]},
    {path:'account/admin/advisors-manage',component:ManageAdvisorComponent,title:'อาจารย์ที่ปรึกษาปริญญานิพนธ์'},
    {path:'account/admin/thesis-upload',component:ManageThesisComponent,title:'รายการปริญญานิพนธ์ที่ต้องตรวจสอบ'},
    {path:'account/admin/student',component:ManageStudentComponent,title:'สิทธิการใช้งาน'}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
