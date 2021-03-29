import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPermissionsModule } from './user-permissions.module';
import { RouterModule, Routes } from '@angular/router';
import { UserPermissionsListComponent } from './user-permissions-list/user-permissions-list.component';
import { UserService } from '../user/user.service';

const routes: Routes = [
  { path: '',
    redirectTo: 'user-permissions-list',
    pathMatch: 'full'
  },
  {
    path: 'user-permissions-list',
    component: UserPermissionsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPermissionsRoutingModule { }
