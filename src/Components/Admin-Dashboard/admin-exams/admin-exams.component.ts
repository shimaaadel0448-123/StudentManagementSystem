import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../Shared/services/exam.service';
import { Iexam } from '../../Shared/module/iexam';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSideBarComponent } from '../admin-side-bar/admin-side-bar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-exams-admin',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './admin-exams.component.html',
  styleUrl: './admin-exams.component.css'
})
export class AdminExamsComponent implements OnInit {
  exams!: Iexam[];
  selectedExam!: Iexam;
  isModalOpen: boolean = false;

  constructor(private examService: ExamService) { }

  ngOnInit(): void {
    this.examService.getAllExams().subscribe({
      next: (data: Iexam[]) => {
        this.exams = data;
        console.log(data);
      }
    });
  }

  openModal(exam: Iexam) {
    this.selectedExam = { ...exam };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  deleteExam(examId?: number) {
    this.examService.deleteExam(examId!).subscribe(
      {
        next: () => {
          this.exams = this.exams.filter(e => e.id !== examId)
          alert("Exam Deleted Successfully")
        },
        error:(err)=>
        {
          console.log(err)
        }
      }
    )
  }

  saveChanges() {
    if (this.selectedExam) {
      this.examService.updateExam(this.selectedExam.id!, this.selectedExam).subscribe({
        next: () => {
          alert("Exam updated successfully");
          const index = this.exams.findIndex(e => e.id === this.selectedExam.id);
          if (index !== -1) {
            this.exams[index] = { ...this.selectedExam };
          }
          this.isModalOpen = false;
        },
        error: (err) => {
          console.error("Error updating exam", err);
        }
      });
    }
  }

}
