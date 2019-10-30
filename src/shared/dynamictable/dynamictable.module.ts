import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamictableComponent } from './dynamictable.component';

@NgModule({
  declarations: [DynamictableComponent],
  imports: [
    CommonModule
  ],
  exports: [DynamictableComponent]
})
export class DynamictableModule { }
