import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Iresult } from './../module/iresult';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  private apiUrl = 'http://localhost:3000/results'

  constructor(private http: HttpClient) { }
  saveResult(result: Iresult): Observable<Iresult> {
    return this.http.post<Iresult>(this.apiUrl, result);
  }

  getAllResults(): Observable<Iresult[]> {
    return this.http.get<Iresult[]>(this.apiUrl);
  }
}
