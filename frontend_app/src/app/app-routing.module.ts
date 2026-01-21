import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchCoursesComponent } from './search-courses/search-courses.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { SummarizeComponent } from './summarize/summarize.component';
import { GenerateQuizComponent } from './generate-quiz/generate-quiz.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { CourseProgressComponent } from './course-progress/course-progress.component';

const routes: Routes = [
  { path: 'search-courses', component: SearchCoursesComponent, canActivate: [AuthGuard] },
  { path: 'my-courses', component: MyCoursesComponent, canActivate: [AuthGuard] },
  { path: 'summarize', component: SummarizeComponent, canActivate: [AuthGuard] },
  { path: 'generate-quiz', component: GenerateQuizComponent, canActivate: [AuthGuard] },
  { path: 'course-progress', component: CourseProgressComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
