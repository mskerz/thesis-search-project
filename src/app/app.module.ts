import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { SimpleSearchComponent } from './page/simple-search/simple-search.component';
import { AdvanceSearchComponent } from './page/advance-search/advance-search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RootComponent } from './page/root/root.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RegisterComponent } from './page/account/register/register.component';
import { LoginComponent } from './page/account/login/login.component';
import { ChangePasswordComponent } from './page/account/change-password/change-password.component';
import { ChangeInfoComponent } from './page/account/change-info/change-info.component';
import { ImportThesisComponent } from './page/role/student/import-thesis/import-thesis.component';
import { ManageAdvisorComponent } from './page/role/admin/manage-advisor/manage-advisor.component';
import { ManageThesisComponent } from './page/role/admin/manage-thesis/manage-thesis.component';
import { ThesisDecriptionComponent } from './page/thesis-decription/thesis-decription.component';
import { AddAdvisorComponent } from './component/popup/add-advisor/add-advisor.component';
import { EditAdvisorComponent } from './component/popup/edit-advisor/edit-advisor.component';
import { EditThesisComponent } from './component/popup/edit-thesis/edit-thesis.component';
import { ForgotPasswordSendEmailComponent } from './page/account/reset-password/forgot-password-send-email/forgot-password-send-email.component';
import { ForgotPasswordSendTokenComponent } from './page/account/reset-password/forgot-password-send-token/forgot-password-send-token.component';
import { ForgotPasswordNewPasswordComponent } from './page/account/reset-password/forgot-password-new-password/forgot-password-new-password.component';
import { MatMenuModule } from '@angular/material/menu';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import {MatCardModule } from '@angular/material/card'
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { ManageStudentComponent } from './page/role/admin/manage-student/manage-student.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialogModule } from '@angular/material/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SkeletonModule } from 'primeng/skeleton';
import { SafePipe } from './pipes/safe.pipe';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule as Spinner } from 'primeng/progressspinner';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import {DialogModule} from 'primeng/dialog';
import { MyThesisComponent } from './page/my-thesis/my-thesis.component';
import { ManageAdminComponent } from './page/role/admin/manage-admin/manage-admin.component';
import { AdminDashboardComponent } from './page/role/admin/admin-dashboard/admin-dashboard.component'

import { CardModule } from 'primeng/card';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {TableModule} from 'primeng/table';
import { AdminAddComponent } from './component/popup/admin-add/admin-add.component';
import { MessagesModule } from 'primeng/messages';






@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SimpleSearchComponent,
    AdvanceSearchComponent,
    RootComponent,
    RegisterComponent,
    LoginComponent,
    ChangePasswordComponent,
    ChangeInfoComponent,
    ImportThesisComponent,
    ManageAdvisorComponent,
    ManageThesisComponent,
    ThesisDecriptionComponent,
    AddAdvisorComponent,
    EditAdvisorComponent,
    EditThesisComponent,
    ForgotPasswordSendEmailComponent,
    ForgotPasswordSendTokenComponent,
    ForgotPasswordNewPasswordComponent,
    ManageStudentComponent,
    SafePipe,
    MyThesisComponent,
    ManageAdminComponent,
    AdminDashboardComponent,
    AdminAddComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DropdownModule,FormsModule,InputTextModule,InputTextModule,ButtonModule,MatMenuModule,MatCardModule,
    ReactiveFormsModule,MatIconModule,MatTableModule,MatButtonModule,NgxPaginationModule,MatDialogModule,AutoCompleteModule,
    SkeletonModule,PaginatorModule,TagModule,Spinner,PasswordModule,FloatLabelModule,DialogModule,CardModule,
    BreadcrumbModule,TableModule,MessagesModule
    
    
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide:HTTP_INTERCEPTORS,
      useClass:CacheInterceptor,
      multi: true
    },
     
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
