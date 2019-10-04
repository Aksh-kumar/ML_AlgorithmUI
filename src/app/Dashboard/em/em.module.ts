import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmComponent } from './em.component';
import { Routes, RouterModule } from '@angular/router';
import { EMService } from 'src/Services/em.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ChartModule } from 'angular-highcharts';
const routes: Routes = [
  {
      path: '', component: EmComponent
  }];

@NgModule({
  declarations: [EmComponent],
  imports: [
    CommonModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports : [EmComponent, RouterModule],
  providers : [EMService]
})
export class EmModule { }
