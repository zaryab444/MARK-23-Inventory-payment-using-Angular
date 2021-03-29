import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
      path: '',
      redirectTo: 'fraud-dashboard',
      pathMatch: 'full'
  },
  {
    path: 'fraud-dashboard',
    loadChildren: () => import('./fraud-dashboard/fraud-dashboard.module').then(m => m.FraudDashboardModule),
},
  {
      path: 'transaction-control',
      loadChildren: () => import('./transaction-controls/transaction-controls.module').then(m => m.TransactionControlsModule),
  },
  {
    path: 'transaction-data-control',
    loadChildren: () => import('./transaction-data-control/transaction-data-control.module').then(m => m.TransactionDataControlModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FraudMgmtRoutingModule { }
