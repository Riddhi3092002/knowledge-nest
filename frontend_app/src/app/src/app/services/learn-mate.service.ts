import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuizResponse {
  questions: Question[];
}

@Injectable({
  providedIn: 'root',
})
export class LearnMateService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8000/api';

  getUniqueCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/unique-categories`);
  }

  getCoursesByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses/by-topic/${category}`);
  }

  addCourse(courseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addCourseToUser`, courseData);
  }

  getUserCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user-courses`);
  }

  getCourse(courseName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/course/by-name/${courseName}`);
  }

  addComment(courseName: string, commentObj: { comments: string, date: string }) {
  return this.http.post(`${this.apiUrl}/user-course/add-comment`, {
    course_name: courseName,
    comment: commentObj
  });
}

  updateMilestones(
    courseName: string,
    milestones: { week: number; completed: boolean; date: string | null }[]
  ) {
    return this.http.post(`${this.apiUrl}/user-course/update-milestones`, {
      course_name: courseName,
      milestones: milestones,
    });
  }

  completeCourse(courseName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user-course/complete`, {
      course_name: courseName,
    });
  }

  summarizeText(text: string): Observable<any> {
    const formData = new FormData();
    formData.append('text', text);
    return this.http.post(`http://localhost:8000/utils/summarize/`, formData);
  }

  summarizeFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('pdf', file); // must match backend param name
    return this.http.post(`http://localhost:8000/utils/summarize/`, formData);
  }

  generateQuiz(skills: string): Observable<QuizResponse> {
    return this.http.post<QuizResponse>(`http://localhost:8000/quiz/generate/`, { skills });
  }

  getCompletedSkills(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:8000/quiz/completed-skills/');
  }
}
