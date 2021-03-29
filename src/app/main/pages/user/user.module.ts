import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { UserTableComponent } from './user-table/user-table.component';
import { NoFoundModule } from '@fuse/components/no-found/no-found.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgxMaskModule} from 'ngx-mask';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserFormComponent } from './user-form/user-form.component';
import {MatChipsModule} from '@angular/material/chips';

import { UserEditComponent } from './user-edit/user-edit.component';
import { MatMenuModule } from '@angular/material/menu';
import { AdvancedSearchModule } from '@fuse/components/advanced-search/advanced-search.module';
import { ScrollBottomModule } from '@fuse/components/scroll-bottom/scroll-bottom.module';


@NgModule({
  declarations: [UserListComponent, UserTableComponent, ChangePasswordComponent, UserCreateComponent, UserFormComponent, UserEditComponent],
  entryComponents :[UserTableComponent],
  exports: [
    UserListComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatToolbarModule,
    FuseSharedModule,
    MatIconModule,
    NoFoundModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatDividerModule,
    MatSlideToggleModule,
    NgxMaskModule.forRoot(),
    MatChipsModule,
    MatMenuModule,
    AdvancedSearchModule,
    ScrollBottomModule
    

  ]
})
export class UserModule { }
