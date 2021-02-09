import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { ListComponent } from './list/list.component';
import {MatButtonModule} from '@angular/material/button';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {ReactiveFormsModule} from '@angular/forms';
import {EditComponent} from './edit/edit.component';
import { ScheduleComponent } from './schedule/schedule.component';
import {MatRadioModule} from '@angular/material/radio';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { EffectsModule } from '@ngrx/effects';
import {ScheduleEffects} from './effects/schedule.effects';
import {AffirmationEffects} from './effects/affirmation.effects';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    CreateComponent,
    DetailComponent,
    EditComponent,
    ScheduleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, {
      metaReducers
    }),
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    MatNativeDateModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatRadioModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    EffectsModule.forRoot([AffirmationEffects, ScheduleEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
