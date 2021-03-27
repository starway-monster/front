import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/dashboard/dashboard.module')
          .then(m => m.DashboardModule)
      },
      {
        path: 'unescrow',
        loadChildren: () => import('./pages/unescrow-token/unescrow-token.module')
          .then(m => m.UnescrowTokenModule)
      },
      {
        path: 'channels',
        loadChildren: () => import('./pages/channels/channels.module')
          .then(m => m.ChannelsModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
