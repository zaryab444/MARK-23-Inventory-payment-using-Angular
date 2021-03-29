import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisputeDetailsComponent } from '../disputes/dispute-details/dispute-details.component';
import { DisputesComponent } from '../disputes/disputes.component';
import { PayementFeesReportsComponent } from './payement-fees-reports/payement-fees-reports.component';
import { ReportManagerComponent } from './report-manager.component';
import { ScheduledReportsComponent } from './scheduled-reports/scheduled-reports.component';
import { TransactionsSummaryComponent } from './transactions-summary/transactions-summary.component';
import { TransactionsComponent } from './transactions/transactions.component';

const routes: Routes = [
  { path: '', component: ReportManagerComponent, pathMatch: 'full'},
  { path: 'disputes', component: DisputesComponent},
  {
    path: 'disputes/disputeDetail',
    component: DisputeDetailsComponent
  },
  { path: 'schedule', component: ScheduledReportsComponent},
  { path: 'transactions', component: TransactionsComponent},
  { path: 'summary', component: TransactionsSummaryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportManagerRoutingModule { }
