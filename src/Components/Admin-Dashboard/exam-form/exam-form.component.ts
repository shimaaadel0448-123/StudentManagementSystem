import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExamService } from '../../Shared/services/exam.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.css']
})
export class ExamFormComponent implements OnInit {
  step = 1;
  examId = 0;
  formData!: FormGroup;
  questionsForm!: FormGroup;

  constructor(private fb: FormBuilder, private examService: ExamService) {}

  ngOnInit(): void {
    // ✅ إنشاء النموذج الأساسي للامتحان
    this.formData = this.fb.group({
      title: ['', Validators.required],
      time: [0, [Validators.required, Validators.min(1)]],
      numberOfQuestions: [1, [Validators.required, Validators.min(1)]],
      difficulty: ['', Validators.required],
      available: [true]
    });

    // ✅ نموذج للأسئلة
    this.questionsForm = this.fb.group({
      questions: this.fb.array([])
    });
  }

  // ✅ الوصول إلى مصفوفة الأسئلة
  get questionsArray(): FormArray {
    return this.questionsForm.get('questions') as FormArray;
  }

  // ✅ توليد الحقول الخاصة بالأسئلة ديناميكيًا
  goToQuestions() {
    const num = this.formData.value.numberOfQuestions;
    this.questionsArray.clear();

    for (let i = 0; i < num; i++) {
      this.questionsArray.push(
        this.fb.group({
          id: [Date.now() + i], // إعطاء معرف فريد لكل سؤال
          text: ['', Validators.required],
          options: this.fb.array([
            this.fb.control('', Validators.required),
            this.fb.control('', Validators.required),
            this.fb.control('', Validators.required),
            this.fb.control('', Validators.required)
          ]),
          correctAnswer: ['', Validators.required]
        })
      );
    }
    this.step = 2;
  }

  // ✅ الوصول لخيارات السؤال الواحد
  getOptions(questionIndex: number): FormArray {
    return this.questionsArray.at(questionIndex).get('options') as FormArray;
  }

  // ✅ حفظ الامتحان
  saveExam() {
    const examData = {
      id: Date.now().toString(),
      title: this.formData.value.title,
      available: this.formData.value.available,
      completed: false,
      examTime: this.formData.value.time,
      difficulty: this.formData.value.difficulty,
      numberOfQuestions: this.formData.value.numberOfQuestions,
      time: this.formData.value.time,
      numOfStudents: 0,
      questions: this.questionsForm.value.questions
    };

    this.examService.addExam(examData).subscribe(() => {
      alert("✅ Exam added successfully!");
      this.step = 1;
      this.formData.reset({ available: true, numberOfQuestions: 1, time: 0 });
      this.questionsArray.clear();
    });
  }
}
