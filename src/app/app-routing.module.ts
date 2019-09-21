import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {JobComponent} from './job/job.component';
import {AppComponent} from './app.component'
import {SsoComponent} from './sso/sso.component';
const routes: Routes = [
  { path: '', component: AppComponent,
      children: [
         { path: 'home', component: SsoComponent },
         {path : 'jobs' , component: JobComponent}
      ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
