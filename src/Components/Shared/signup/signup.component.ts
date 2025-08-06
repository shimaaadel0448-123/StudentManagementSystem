import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Iuser } from '../module/iuser';
import { UserDataService } from '../services/user-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit {
  users: Iuser[] = []
  constructor(private userData: UserDataService, private router: Router) { }

  ngOnInit(): void {
    this.userData.getUserData().subscribe(
      {
        next: (data) => { this.users = data },
        error: (err) => { console.log(err) }
      }
    )
  }

  registerForm = new FormGroup(
    {
      Name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(6)
      ]),
      LastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(6)
      ]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(9)
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      StudentId: new FormControl('', Validators.required)
    },
    {
      validators: (form: AbstractControl): ValidationErrors | null => {
        const pass = form.get('Password')?.value;
        const confirm = form.get('confirmPassword')?.value;
        return pass === confirm ? null : { passwordMismatch: true };
      }
    }
  );

  get getName() { return this.registerForm.get('Name'); }

  get getLastName() { return this.registerForm.get('LastName'); }

  get getEmail() { return this.registerForm.get('Email'); }

  get getPassword() { return this.registerForm.get('Password'); }

  get getConfirmPassword() { return this.registerForm.get('confirmPassword'); }

  get getStudentId() { return this.registerForm.get('StudentId'); }

  onSubmit() {
    const isExisted = this.users.find(u => u.email === this.getEmail?.value);
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    if (isExisted) {
      Swal.fire({
        icon: "error",
        text: "This Email Already Exists",
      });
      return;
    }

    const formValue = this.registerForm.value;
    const enteredUserData: Iuser = {
      name: formValue.Name + ' ' + formValue.LastName,
      email: formValue.Email as string,
      password: formValue.Password as string,
      available: true,
      completed: false,
      studentId: Number(formValue.StudentId),
      completedExams: [
        { examTitle: "test", score: 0 },
      ]
    };


    alert('Registered Successfully');

    this.userData.setUserData(enteredUserData).subscribe({
      next: () => {
        this.router.navigate(['login']);
      }
    });

    this.registerForm.reset();
  }
}
