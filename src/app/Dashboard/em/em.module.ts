import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmComponent } from './em.component';
import { Routes, RouterModule } from '@angular/router';
import { EMService } from 'src/Services/em.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ChartModule } from 'angular-highcharts';
import { SoftCountIteratorPipe } from 'src/pipes/softcountiterator.pipe';
import { SoftCountPipe } from 'src/pipes/softcount.pipe';
import { DynamictableModule } from 'src/shared/dynamictable/dynamictable.module';
const routes: Routes = [
  {
      path: '', component: EmComponent
  }];

@NgModule({
  declarations: [
    EmComponent,
    SoftCountIteratorPipe, SoftCountPipe
  ],
  imports: [
    CommonModule,
    ChartModule,
    FormsModule,
    DynamictableModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports : [EmComponent, RouterModule],
  providers : [EMService, SoftCountIteratorPipe, SoftCountPipe]
})
export class EmModule { }
