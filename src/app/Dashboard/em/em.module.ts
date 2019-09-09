import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmComponent } from './em.component';
import { Routes, RouterModule } from '@angular/router';
import { EMService } from 'src/Services/em.service';

const routes: Routes = [
  {
      path: '', component: EmComponent
  }];

@NgModule({
  declarations: [EmComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports : [EmComponent, RouterModule],
  providers : [EMService]
})
export class EmModule { }
