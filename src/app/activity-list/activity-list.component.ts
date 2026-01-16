import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.scss'
})
export class ActivityListComponent implements OnInit {
  activities: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadActivities();
    this.apiService.activityAdded$.subscribe(() => {
      this.loadActivities();
    });
  }

  loadActivities(): void {
    this.apiService.getActivities().subscribe(data => {
      if (data) {
        this.activities = data;
        this.activities.sort((a, b) => {
          // Convert strings to Date objects
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();

          // Descending order (newest first)
          return dateB - dateA;
        });
      }
    });
  }

  getIconClass(activityType: string): string {
    switch (activityType) {
      case 'RUNNING':
        return 'fas fa-running fa-lg';
      case 'CYCLING':
        return 'fas fa-bicycle fa-lg';
      case 'SWIMMING':
        return 'fas fa-swimmer fa-lg';
      case 'YOGA':
        return 'fas fa-child fa-lg';
      default:
        return 'fas fa-dumbbell fa-lg';
    }
  }

}
