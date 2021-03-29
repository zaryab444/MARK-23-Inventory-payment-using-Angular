import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FraudDashboardRoutingModule } from './fraud-dashboard-routing.module';
import { FraudDashboardListComponent } from './fraud-dashboard-list/fraud-dashboard-list.component';
import { FraudDashboardTableComponent } from './fraud-dashboard-table/fraud-dashboard-table.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [FraudDashboardListComponent, FraudDashboardTableComponent],
  imports: [
    CommonModule,
    FraudDashboardRoutingModule,
    FuseSharedModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    MatButtonModule
   
  ]
})
export class FraudDashboardModule { }
