import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getActivities(): Observable<any> {
    return this.http.get(`${API_URL}/activities`);
  }

  addActivity(activity: any): Observable<any> {
    return this.http.post(`${API_URL}/activities`, activity);
  }

  getActivityDetail(id: string): Observable<any> {
    return this.http.get(`${API_URL}/recommendations/activity/${id}`);
  }
}
