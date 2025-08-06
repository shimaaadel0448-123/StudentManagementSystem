import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../Shared/services/exam.service';
import { Iexam } from '../../Shared/module/iexam';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserDataService } from '../../Shared/services/user-data.service';
import { Iuser } from '../../Shared/module/iuser';

@Component({
  selector: 'app-all-exams',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './all-exams.component.html',
  styleUrls: ['./all-exams.component.css']
})
export class AllExamsComponent implements OnInit {
  exams: Iexam[] = [];
  userData!: Iuser;

  constructor(
    private examService: ExamService,
    private userService: UserDataService
  ) { }

  ngOnInit(): void {
    const userId = localStorage.getItem("userId")!;
    this.userService.getUserDataById(userId).subscribe({
      next: (user) => {
        this.userData = user;

        this.examService.getAllExams().subscribe({
          next: (examsList: Iexam[]) => {
            const completedTitles = this.userData?.completedExams?.map(e => e.examTitle) || [];
            this.exams = examsList.map(exam => ({
              ...exam,
              completed: completedTitles.includes(exam.title)
            }));
          }
        });
      }
    });
  }
}
