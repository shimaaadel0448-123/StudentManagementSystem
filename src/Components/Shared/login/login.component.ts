import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { Iuser } from '../module/iuser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: Iuser[] = []
  constructor(private router: Router, private usersData: UserDataService) { }

  ngOnInit(): void {
    this.usersData.getUserData().subscribe(
      {
        next: (d) => { this.user = d
          console.log(this.user)
         }
      }
    )
  }
  loginForm = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', Validators.required)
  });

  get getEmail() {
    return this.loginForm.get('Email');
  }

  get getPassword() {
    return this.loginForm.get('Password');
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.get('Email')?.value;
    const password = this.loginForm.get('Password')?.value;

    // Admin Data
    const adminEmail = 'admin123@gmail.com';
    const adminPassword = 'admin123';
    if (email === adminEmail && password === adminPassword) {
      alert('Welcome Admin!');
      this.router.navigate(['/admin/exams']);
      this.loginForm.reset();
      return;
    }
    const isExisted = this.user.find(u => u.email == this.getEmail?.value && u.password == this.getPassword?.value)
    if (isExisted) {
      localStorage.setItem("userId",isExisted.id)
      alert(`Welcome ${isExisted.name || 'User'}!`);
      this.router.navigate(['/allExams']);
      this.loginForm.reset();
    } else {
      alert('Invalid email or password! Please try again.');
    }
  }

}
