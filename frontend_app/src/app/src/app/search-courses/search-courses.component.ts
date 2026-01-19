import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LearnMateService } from '../services/learn-mate.service';
import { MatDialog } from '@angular/material/dialog';
import { CourseDetailDialogComponent } from '../course-detail-dialog/course-detail-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-courses',
  templateUrl: './search-courses.component.html',
  styleUrls: ['./search-courses.component.css']
})
export class SearchCoursesComponent implements OnInit {

  courseTopics: string[] = [];
  selectedTopic: string = '';
  courses: any[] = [];

  @ViewChild('successDialog') successDialog!: TemplateRef<any>;
  @ViewChild('errorDialog') errorDialog!: TemplateRef<any>;

  constructor(private learnMateService: LearnMateService, private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.getUniqueCategories();
  }

  getUniqueCategories() {
    this.learnMateService.getUniqueCategories().subscribe(
      (data: string[]) => {
        this.courseTopics = data;
      },
      (error) => {
        console.error('Error fetching unique categories:', error);
      }
    );
  }

  searchCourses() {
    this.learnMateService.getCoursesByCategory(this.selectedTopic).subscribe(
      (data: any[]) => {
        // Convert Skills string to array for display
        this.courses = data.map(course => ({
          ...course,
          Skills: course.Skills
            ? course.Skills.split(',').map((s: string) => s.trim()).filter((s: string) => s)
            : []
        }));
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  startCourse(course: any) {
    console.log('Start course:', course);
    this.learnMateService.addCourse(course).subscribe(
      (response) => {
         const dialogRef = this.dialog.open(this.successDialog, {
          data: response.message,
          panelClass: 'success-dialog-panel',
          width: '350px', 
          minWidth: '300px'
        });
        setTimeout(() => {
          dialogRef.close();
          this.router.navigate(['/my-courses']);
        }, 1500);
        
      },
      (error) => {
       this.dialog.open(this.errorDialog, {
          data: 'Failed to add course.',
          panelClass: 'error-dialog-panel',
          width: '350px', 
          minWidth: '300px'
        });
      }
    );
  }

  openCourseDetail(course: any) {
  this.dialog.open(CourseDetailDialogComponent, {
    width: '800px',
    height: '600px',
    data: course
  });
  }
}