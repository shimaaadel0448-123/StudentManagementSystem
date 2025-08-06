import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../Shared/services/user-data.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  data: any
  constructor(private userData: UserDataService) {

  }
  ngOnInit(): void {
    this.userData.getUserData().subscribe(
      {
        next:(Data: any)=>
          { this.data=Data[Data.length-1],
            console.log(this.data)
          },
        error:(err)=>console.log(err)
      }
    )
  }

}
