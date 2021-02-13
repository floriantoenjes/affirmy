import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListComponent} from './list/list.component';
import {CreateComponent} from './create/create.component';
import {DetailComponent} from './detail/detail.component';
import {EditComponent} from './edit/edit.component';
import {ScheduleComponent} from './schedule/schedule.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create', component: CreateComponent },
  { path: 'detail/:id', component: DetailComponent},
  { path: 'detail/:id/edit', component: EditComponent},
  { path: 'detail/:id/schedule', component: ScheduleComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
