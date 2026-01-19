import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material/material.module';
import { SearchCoursesComponent } from './src/app/search-courses/search-courses.component';
import { MyCoursesComponent } from './src/app/my-courses/my-courses.component';
import { SummarizeComponent } from './src/app/summarize/summarize.component';
import { GenerateQuizComponent } from './src/app/generate-quiz/generate-quiz.component';
import { DashboardComponent } from './src/app/dashboard/dashboard.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CourseDetailDialogComponent } from './src/app/course-detail-dialog/course-detail-dialog.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { CourseProgressComponent } from './src/app/course-progress/course-progress.component';

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
