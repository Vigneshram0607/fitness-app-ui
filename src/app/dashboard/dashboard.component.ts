import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivityListComponent } from "../activity-list/activity-list.component";
import { ActivityFormComponent } from '../activity-form/activity-form.component';
import { DashboardStatsService } from '../services/dashboard-stats.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ActivityListComponent, ActivityFormComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalCaloriesBurned: number = 0;
  totalWorkouts: number = 0;
  avgDuration: number = 0;
  calorieChangePercentage: number = 0;
  
  private statsSubscription!: Subscription;

  constructor(private dashboardStatsService: DashboardStatsService){}

  ngOnInit() {
    this.statsSubscription = this.dashboardStatsService.stats$.subscribe(stats => {
      this.totalCaloriesBurned = stats.totalCaloriesBurned;
      this.totalWorkouts = stats.totalWorkouts;
      this.avgDuration = stats.avgDuration;
      this.calorieChangePercentage = stats.calorieChangePercentage;
    });
  }

  ngOnDestroy() {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
  }
}


