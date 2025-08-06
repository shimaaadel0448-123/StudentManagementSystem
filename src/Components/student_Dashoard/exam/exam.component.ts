import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../Shared/services/exam.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Iexam } from '../../Shared/module/iexam';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../Shared/services/user-data.service';
import { ResultsService } from '../../Shared/services/results.service';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
})
export class ExamComponent implements OnInit {
  examId!: any;
  examDetails!: Iexam;
  formQuestion!: FormGroup;
  currentQuestionIndex: number = 0;
  userName!: string;
  timeLeft: number = 0;
  intervalId: any;
  userId!: string;

  constructor(
    private examService: ExamService,
    private route: ActivatedRoute,
    private userDataService: UserDataService,
    private router: Router,
    private resultService: ResultsService
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem("userId")!;
    this.examId = this.route.snapshot.paramMap.get('id')!;

    this.examService.getQuestionByExamId(this.examId).subscribe({
      next: (data) => {
        this.examDetails = data;
        this.createForm();

        this.timeLeft = (this.examDetails.time || 10) * 60;
        this.startTimer();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  createForm() {
    const group: { [key: string]: FormControl } = {};
    this.examDetails.questions.forEach((_: any, index: number) => {
      group['question_' + index] = new FormControl('', Validators.required);
    });
    this.formQuestion = new FormGroup(group);
  }

  startTimer() {
    this.intervalId = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.intervalId);
        alert("⏰ Time's up! Auto-submitting your exam.");
        this.onSubmit();
      }
    }, 1000);
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.examDetails.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  onSubmit() {
    clearInterval(this.intervalId);

    if (this.formQuestion.valid) {
      let correctCount = 0;
      const answersResult: {
        questionId: number;
        userAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
      }[] = [];
      const updatedExam = {
        ...this.examDetails,
        numOfStudents: this.examDetails.numOfStudents + 1
      };
      this.examService.updateExam(this.examId, updatedExam).subscribe({
        next: (response) => {
          console.log('Number of students updated successfully:', response);
        },
        error:(error) => {
        console.error('Failed to update number of students:', error);
      }}

);
    this.examDetails.questions.forEach((question: { correctAnswer: any; id: any; }, index: string) => {
      const controlName = 'question_' + index;
      const userAnswer = this.formQuestion.get(controlName)?.value;
      const correctAnswer = question.correctAnswer;

      const isCorrect = userAnswer === correctAnswer;
      if (isCorrect) correctCount++;

      answersResult.push({
        questionId: question.id,
        userAnswer,
        correctAnswer,
        isCorrect
      });
    });

    localStorage.setItem('totalQuestions', this.examDetails.numberOfQuestions.toString());

    this.userDataService.getUserDataById(this.userId).subscribe({
  next: (userData) => {
    console.log("📌 User Data:", userData);

    this.userName = userData.name || "Unknown User";

    this.resultService.saveResult({
      userName: this.userName,
      examTitle: this.examDetails.title,
      score: correctCount
    }).subscribe({
      next: () => console.log("Result saved successfully"),
      error: (err) => console.error("Failed to save result", err)
    });

    const updatedCompletedExams = [
      ...(userData.completedExams || []),
      {
        examTitle: this.examDetails.title,
        score: correctCount
      }
    ];

    const updatedUserData = {
      ...userData,
      available: false,
      completed: true,
      completedExams: updatedCompletedExams
    };

    this.userDataService.updateUserData(this.userId, updatedUserData).subscribe({
      next: () => {
        this.userDataService.setScore(correctCount);
        this.router.navigate(['/result', this.examId]);
      },
      error: (err) => console.error("❌ Failed to update user", err)
    });
  },
  error: (err) => console.error("❌ Failed to fetch user data", err)
});



  } else {
  alert('Please answer all questions.');
  this.formQuestion.markAllAsTouched();
}
  }
}
