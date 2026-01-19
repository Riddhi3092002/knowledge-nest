import { Component, OnInit } from '@angular/core';
import { LearnMateService } from '../services/learn-mate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css']
})
export class MyCoursesComponent implements OnInit {
  selectedTab = 'in-progress';
  courses: any[]  = [];
  filteredCourses: any[] = [];

  constructor(private learnMateService: LearnMateService, private router: Router) {
  }

  ngOnInit() {
    this.filterCourses();
    this.getUserCourses();
  }

  getUserCourses() {
    this.learnMateService.getUserCourses().subscribe(
      (courses: any[]) => {
        console.log('User courses:', courses);
        this.courses = courses;
        this.filterCourses();
      }
    );
    (error: any) => {
      console.error('Error fetching user courses:', error);
    }
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    this.filterCourses();
  }

  filterCourses() {
    this.filteredCourses = this.courses.filter(
      c => c.status === this.selectedTab
    );
  }

  getCompletedMilestones(course: any): number {
    return course.milestones.filter((m: any) => m.completed).length;
  }

  getProgress(course: any): number {
    if (!course.milestones.length) return 0;
    return (this.getCompletedMilestones(course) / course.milestones.length) * 100;
  }

   viewDetails(course: any) {
    this.router.navigate(['course-progress'], { state: { course } });
  }
}