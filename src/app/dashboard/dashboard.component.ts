import { Component, ViewChild } from '@angular/core';
import { ActivityListComponent } from "../activity-list/activity-list.component";
import { ActivityFormComponent } from '../activity-form/activity-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ActivityListComponent, ActivityFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @ViewChild(ActivityListComponent) activityListComponent!: ActivityListComponent;

  onActivityAdded() {
    // this.activityListComponent.fetchActivities();
  }
}


