// generate-quiz.component.ts
import { Component, OnInit } from '@angular/core';
import { LearnMateService } from '../services/learn-mate.service';

@Component({
  selector: 'app-generate-quiz',
  templateUrl: './generate-quiz.component.html',
  styleUrls: ['./generate-quiz.component.css']
})
export class GenerateQuizComponent implements OnInit {
  availableSkills: string[] = [];
  selectedSkills: string[] = [];
  quiz: any = null;
  userAnswers: string[] = [];
  results: {correct: boolean, correctAnswer: string}[] = [];
  score: number = 0;
  loading: boolean = false;
  
  constructor(private learnmateService: LearnMateService) {}

  ngOnInit() {
    this.learnmateService.getCompletedSkills().subscribe({
      next: (res: string[]) => this.availableSkills = res,
      error: (err) => console.error("Error fetching skills", err)
    });
  }

  generateQuiz() {
    if (this.selectedSkills.length === 0) {
      alert("Select at least one skill.");
      return;
    }

    this.loading = true;
    const skillsStr = this.selectedSkills.join(", ");
    this.learnmateService.generateQuiz(skillsStr).subscribe({
      next: (res) => {
        console.log(res);
        this.quiz = res;
        this.userAnswers = Array(res.questions.length).fill('');
        this.results = [];
        this.loading = false;
      },
      error: (err) => {
        alert(err.error?.detail || "Error generating quiz.");
        this.loading = false;
      }
    });
  }

  submitQuiz() {
    if (!this.quiz) return;

    let correctCount = 0;
    this.results = this.quiz.questions.map((q: any, i: number) => {
      const userAnswer = this.userAnswers[i]?.toUpperCase() || '';
      const correctAnswer = q.answer.toUpperCase();
      const isCorrect = userAnswer === correctAnswer;
      if (isCorrect) correctCount++;
      return { correct: isCorrect, correctAnswer };
    });

    this.score = correctCount;
  }

}
