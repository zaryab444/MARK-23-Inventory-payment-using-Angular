import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportManagerRoutingModule } from './report-manager-routing.module';
import { TransactionsSummaryComponent } from './transactions-summary/transactions-summary.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ScheduledReportsComponent } from './scheduled-reports/scheduled-reports.component';
import { PayementFeesReportsComponent } from './payement-fees-reports/payement-fees-reports.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { ReportManagerComponent } from './report-manager.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SummmaryTableComponent } from './common-components/summmary-table/summmary-table.component';
import { MatTableModule } from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { NoFoundModule } from '@fuse/components/no-found/no-found.module';
import { ScrollBottomModule } from '@fuse/components/scroll-bottom/scroll-bottom.module';


@NgModule({
    entryComponents:[
        SummmaryTableComponent
    ],

  declarations: [
    ReportManagerComponent,
    TransactionsSummaryComponent, 
    TransactionsComponent, 
    ScheduledReportsComponent, 
    PayementFeesReportsComponent,
    SummmaryTableComponent 
  ],
  imports: [
    CommonModule,
    ReportManagerRoutingModule,
    FuseSharedModule,
    NoFoundModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatDividerModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    ScrollBottomModule
  ]
})
export class ReportManagerModule { }
