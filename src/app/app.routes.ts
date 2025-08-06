import { Routes } from '@angular/router';
import { LoginComponent } from '../Components/Shared/login/login.component';
import { ProfileComponent } from '../Components/student_Dashoard/profile/profile.component';
import { ResultComponent } from '../Components/student_Dashoard/result/result.component';
import { ForwardComponent } from '../Components/student_Dashoard/forward/forward.component';
import { SignUpComponent } from '../Components/Shared/signup/signup.component';
import { ExamFormComponent } from '../Components/Admin-Dashboard/exam-form/exam-form.component';
import { StudentResultsComponent } from '../Components/Admin-Dashboard/student-results/student-results.component';
import { AllExamsComponent } from '../Components/student_Dashoard/all-exams/all-exams.component';
import { ExamComponent } from '../Components/student_Dashoard/exam/exam.component';
import { AdminExamsComponent } from '../Components/Admin-Dashboard/admin-exams/admin-exams.component';
import { AdminLayoutComponent } from '../Components/Admin-Dashboard/Components/Admin-Dashboard/admin-layout/admin-layout.component';

export const routes: Routes = [
  { path: '', component: ForwardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'allExams', component: AllExamsComponent },
  { path: 'exam/:id', component: ExamComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'result/:id', component: ResultComponent },
  { path: 'userResults', component: StudentResultsComponent },
  {
  path: 'admin',
  component: AdminLayoutComponent,
  children: [
    { path: 'exams', component: AdminExamsComponent },
    { path: 'add-exam', component: ExamFormComponent },
    { path: 'results', component: StudentResultsComponent },
    { path: '', redirectTo: 'exams', pathMatch: 'full' }
  ]
}

];
