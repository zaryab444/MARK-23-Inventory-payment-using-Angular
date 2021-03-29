import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TwostepComponent } from './twostep/twostep.component';

const routes: Routes = [

  {
    path: '',
    component: TwostepComponent,
    pathMatch: 'full'
  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TwofactorRoutingModule { }
