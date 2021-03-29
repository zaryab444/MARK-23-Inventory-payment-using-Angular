import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FraudDashboardListComponent } from './fraud-dashboard-list/fraud-dashboard-list.component';

const routes: Routes = [
  { 
    path: '',
    component: FraudDashboardListComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FraudDashboardRoutingModule { }
