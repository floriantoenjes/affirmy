import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListComponent} from './list/list.component';
import {CreateComponent} from './create/create.component';
import {DetailComponent} from './detail/detail.component';
import {EditComponent} from './edit/edit.component';
import {ScheduleComponent} from './schedule/schedule.component';
import {LoginComponent} from './login/login.component';
import {LoggedInGuard} from './shared/guards/logged-in.guard';
import {LoggedOutGuard} from './shared/guards/logged-out.guard';

const routes: Routes = [
  { path: '', component: ListComponent, canActivate: [LoggedInGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoggedOutGuard] },
  { path: 'create', component: CreateComponent, canActivate: [LoggedInGuard] },
  { path: 'detail/:id', component: DetailComponent, canActivate: [LoggedInGuard] },
  { path: 'detail/:id/edit', component: EditComponent, canActivate: [LoggedInGuard] },
  { path: 'detail/:id/schedule', component: ScheduleComponent, canActivate: [LoggedInGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
