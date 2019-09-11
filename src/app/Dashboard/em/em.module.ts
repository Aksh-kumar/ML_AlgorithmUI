import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmComponent } from './em.component';
import { Routes, RouterModule } from '@angular/router';
import { EMService } from 'src/Services/em.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
const routes: Routes = [
  {
      path: '', component: EmComponent
  }];

@NgModule({
  declarations: [EmComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports : [EmComponent, RouterModule],
  providers : [EMService]
})
export class EmModule { }
