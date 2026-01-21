import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material/material.module';
import { SearchCoursesComponent } from './search-courses/search-courses.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { SummarizeComponent } from './summarize/summarize.component';
import { GenerateQuizComponent } from './generate-quiz/generate-quiz.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CourseDetailDialogComponent } from './course-detail-dialog/course-detail-dialog.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { CourseProgressComponent } from './course-progress/course-progress.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchCoursesComponent,
    MyCoursesComponent,
    SummarizeComponent,
    GenerateQuizComponent,
    DashboardComponent,
    CourseDetailDialogComponent,
    LoginComponent,
    SignupComponent,
    CourseProgressComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
