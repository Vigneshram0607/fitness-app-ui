import { Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    {path: '', redirectTo: 'home',pathMatch: 'prefix'},{
    path:'home',
    component: DashboardComponent
}];
