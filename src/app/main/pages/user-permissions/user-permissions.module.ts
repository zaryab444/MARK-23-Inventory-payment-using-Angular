import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPermissionsListComponent } from './user-permissions-list/user-permissions-list.component';
import { UserPermissionsTableComponent } from './user-permissions-table/user-permissions-table.component';
import { UserPermissionsRoutingModule } from './user-permissions-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoFoundModule } from '@fuse/components/no-found/no-found.module';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxMaskModule } from 'ngx-mask';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ScrollBottomModule } from '@fuse/components/scroll-bottom/scroll-bottom.module';



@NgModule({
  declarations: [UserPermissionsListComponent, UserPermissionsTableComponent],
  imports: [
    CommonModule,
    UserPermissionsRoutingModule,
    MatSelectModule,
    FlexLayoutModule,
    MatFormFieldModule,
    NoFoundModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatToolbarModule,
    NgxMaskModule.forRoot(),
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    ScrollBottomModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]

})
export class UserPermissionsModule { }
