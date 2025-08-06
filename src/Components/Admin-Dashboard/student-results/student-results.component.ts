import { Component, OnInit } from '@angular/core';
import { Iuser } from '../../Shared/module/iuser';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../Shared/services/user-data.service';

@Component({
  selector: 'app-student-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-results.component.html',
  styleUrls: ['./student-results.component.css']
})
export class StudentResultsComponent implements OnInit {
  userData: Iuser[] = [];

  constructor(private userService: UserDataService) {}

  ngOnInit(): void {
    this.userService.getUserData().subscribe({
      next: (res) => {
        this.userData = res.filter(user => user.completedExams && user.completedExams.length > 0);
        console.log(" Students with completed exams:", this.userData);
      },
      error: (err) => {
        console.error('error fetching user data', err);
      }
    });
  }
}
