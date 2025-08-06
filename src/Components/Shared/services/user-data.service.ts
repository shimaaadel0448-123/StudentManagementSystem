import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Iuser } from '../module/iuser';
@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private score: number = 0;
  apiUrl = "http://localhost:3000/user"

  constructor(private http: HttpClient) { }

  setUserData(data: Iuser): Observable<Iuser> {
    return this.http.post<Iuser>(this.apiUrl, data)
  }
  getUserData(): Observable<Iuser[]> {
    return this.http.get<Iuser[]>(this.apiUrl)
  }
  getUserDataById(userId: string): Observable<Iuser> {
    return this.http.get<Iuser>(`${this.apiUrl}/${userId}`)
  }
  setScore(score: number) {
    return this.score = score;
  }
  getScore(): number {
    return this.score;
  }
  updateUserData( id: string,updateUser: any ) {
    return this.http.put<Iuser>(`${this.apiUrl}/${id}`, updateUser);
  }


}
