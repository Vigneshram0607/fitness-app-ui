import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';

export const routes: Routes = [
    
    {path: 'activity', component: DashboardComponent, pathMatch: 'full'},
    {path: 'activity/:activityId', component: ActivityDetailComponent, pathMatch: 'full'},
    {path: '', redirectTo: 'activity', pathMatch: 'full'},{path:'**', redirectTo: 'activity', pathMatch: 'full'},
];



