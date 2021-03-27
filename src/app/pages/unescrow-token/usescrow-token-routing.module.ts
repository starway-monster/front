import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnescrowTokenComponent } from './unescrow-token.component';

const routes: Routes = [
  {
    path: '',
    component: UnescrowTokenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnescrowTokenRoutingModule { }
