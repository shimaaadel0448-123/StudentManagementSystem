import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { Iuser } from '../../Shared/module/iuser';
import { UserDataService } from '../../Shared/services/user-data.service';
import { ExamService } from '../../Shared/services/exam.service';

@Component({
  selector: 'app-result',
  imports: [RouterModule, RouterLink],
  standalone: true,
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  data!: Iuser;
  score!: number;
  total!:any;
  constructor(
    private userData: UserDataService,
    private route: Router,
    private examService: ExamService
  ) { }

  ngOnInit(): void {
    this.total = localStorage.getItem('totalQuestions');
   console.log(this.total)
    const userId = localStorage.getItem("userId");
    if (userId) {
      this.userData.getUserDataById(userId).subscribe({
        next: (data) => {
          this.data = data;
          this.score = this.userData.getScore();
        },
        error: (err) => {
          console.error(' Error fetching user data:', err);
        }
      });
    } else {
      console.error('userId is null. User might not be logged in.');
      this.route.navigate(['/login']);
    }
  }


  getMessage(): string {
    if (this.score >= 8) return ' Excellent! You nailed it!';
    if (this.score >= 5) return ' Good job! Keep practicing.';
    return ' Keep going! Review the material and try again.';
  }
}
