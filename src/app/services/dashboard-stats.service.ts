import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardStatsService {
  private statsSubject = new BehaviorSubject<any>({
    totalCaloriesBurned: 0,
    totalWorkouts: 0,
    avgDuration: 0,
    calorieChangePercentage: 0
  });

  stats$ = this.statsSubject.asObservable();

  updateStats(activities: any[]) {
    const totalWorkouts = activities.length;
    const totalCaloriesBurned = activities.reduce((sum, activity) => sum + activity.caloriesBurned, 0);
    const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0);
    const avgDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;

    const today = new Date();
    const last7DaysStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    const previous7DaysStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 13);
    
    const caloriesLast7Days = this.getCaloriesBurnedInPeriod(activities, last7DaysStart, today);
    const caloriesPrevious7Days = this.getCaloriesBurnedInPeriod(activities, previous7DaysStart, last7DaysStart);

    let calorieChangePercentage = 0;
    if (caloriesPrevious7Days > 0) {
      calorieChangePercentage = ((caloriesLast7Days - caloriesPrevious7Days) / caloriesPrevious7Days) * 100;
    } else if (caloriesLast7Days > 0) {
      calorieChangePercentage = 100;
    }

    this.statsSubject.next({
      totalCaloriesBurned,
      totalWorkouts,
      avgDuration,
      calorieChangePercentage
    });
  }

  private getCaloriesBurnedInPeriod(activities: any[], startDate: Date, endDate: Date): number {
    return activities
      .filter(activity => {
        const activityDate = new Date(activity.startTime);
        return activityDate >= startDate && activityDate < endDate;
      })
      .reduce((sum, activity) => sum + activity.caloriesBurned, 0);
  }
}
