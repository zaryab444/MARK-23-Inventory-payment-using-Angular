import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisputeDetailsComponent } from './dispute-details/dispute-details.component';
import { DisputesComponent } from './disputes.component';

const routes: Routes = [
  {
    path: '',
    component: DisputesComponent,
    pathMatch: 'full'
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisputesRoutingModule { }
