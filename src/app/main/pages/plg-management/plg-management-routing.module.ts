import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlgCreateComponent } from './plg-create/plg-create.component';
import { PlgEditComponent } from './plg-edit/plg-edit.component';
import { PlgListComponent } from './plg-list/plg-list.component';


const routes: Routes = [
  {
  path: '',
  component: PlgListComponent,
  pathMatch: 'full'
  },
  {
    path: 'plg-create',
    component: PlgCreateComponent,
  },
  {
      path: 'plg-edit/:id',
      component: PlgEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlgManagementRoutingModule { }
