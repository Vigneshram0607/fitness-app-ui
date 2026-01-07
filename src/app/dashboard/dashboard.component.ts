import { Component } from '@angular/core';
import { ActivityFormComponent } from "../activity-form/activity-form.component";
import { ActivityListComponent } from "../activity-list/activity-list.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ActivityFormComponent, ActivityListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
