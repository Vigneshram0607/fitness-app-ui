import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

const API_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private activityAddedSource = new Subject<void>();
  activityAdded$ = this.activityAddedSource.asObservable();

  constructor(private http: HttpClient) { }

  getActivities(): Observable<any> {
    return this.http.get(`${API_URL}/activities`);
  }

  addActivity(activity: any): Observable<any> {
    return this.http.post(`${API_URL}/activities`, activity).pipe(
      tap(() => {
        this.activityAddedSource.next();
      })
    );
  }

  getActivityDetail(id: string): Observable<any> {
    return this.http.get(`${API_URL}/recommendations/activity/${id}`);
  }
}
