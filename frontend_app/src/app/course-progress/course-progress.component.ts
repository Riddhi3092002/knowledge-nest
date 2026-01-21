import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LearnMateService } from '../services/learn-mate.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-course-progress',
  templateUrl: './course-progress.component.html',
  styleUrls: ['./course-progress.component.css']
})
export class CourseProgressComponent {
  course: any;
  daysSinceStarted = 0;
  progressPercent = 0;
  newComment = '';
  courseLink = '';
  course_Details: any;
  @ViewChild('errorDialog') errorDialog!: TemplateRef<any>;

  constructor(private router: Router, private learnMateService: LearnMateService, private dialog: MatDialog) {
    const nav = this.router.getCurrentNavigation();
    this.course = nav?.extras.state?.['course'];
    if (this.course) {
      this.calculateDaysSinceStarted();
      this.calculateProgress();
      this.fetchCourseLink();
    }
  }

 calculateDaysSinceStarted() {
  if (this.course.startedAt) {
    const started = new Date(this.course.startedAt);
    const now = new Date();

    // reset to midnight
    started.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    this.daysSinceStarted = Math.floor((now.getTime() - started.getTime()) / (1000 * 60 * 60 * 24));
  }
}

  calculateProgress() {
    if (this.course.milestones && this.course.milestones.length) {
      const completed = this.course.milestones.filter((m: any) => m.completed).length;
      this.progressPercent = (completed / this.course.milestones.length) * 100;
      if (this.progressPercent == 100) {
        this.completeCourse();
      }
    }
  }

  allMilestonesCompleted() {
    return this.course.milestones.every((m: any) => m.completed);
  }

  updateMilestones() {
  const now = new Date().toISOString();
  // Only send milestones that are checked and not already completed
  const updatedMilestones = this.course.milestones
    .filter((m: any) => m.completed && !m.date)
    .map((m: any) => ({
      week: m.week,
      completed: true,
      date: now
    }));

  this.learnMateService.updateMilestones(this.course.courseName, updatedMilestones)
    .subscribe(() => {
      // Mark these milestones as completed locally so they become disabled
      updatedMilestones.forEach((um: any) => {
        const local = this.course.milestones.find((m: any) => m.week === um.week);
        if (local) {
          local.date = um.date;
        }
      });
      this.calculateProgress();
    });
}

  addComment() {
  if (this.newComment.trim()) {
    const commentObj = {
      comments: this.newComment.trim(),
      date: new Date().toISOString()
    };
    this.learnMateService.addComment(this.course.courseName, commentObj)
      .subscribe(() => {
        this.course.comments.unshift(commentObj);
        this.newComment = '';
      });
  }
}

  completeCourse() {
  const completed = this.course.milestones.filter((m: any) => m.completed).length;
  if (completed !== this.course.milestones.length) {
    this.dialog.open(this.errorDialog, {
          data: 'Complete All Milestones!',
          panelClass: 'error-dialog-panel',
          width: '350px', 
          minWidth: '300px'
    });

  }
  
  this.learnMateService.completeCourse(this.course.courseName)
    .subscribe(() => {
      this.course.status = 'completed';
      this.router.navigate(['/my-courses']);
    });
}

  fetchCourseLink() {
    this.learnMateService.getCourse(this.course.courseName).subscribe((course: any) => {
      this.course_Details = course;
    });
  }
}