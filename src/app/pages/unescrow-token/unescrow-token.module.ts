import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnescrowTokenComponent } from './unescrow-token.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
  declarations: [UnescrowTokenComponent],
  imports: [
    CommonModule,
    SharedModule,
    ComponentsModule
  ]
})
export class UnescrowTokenModule { }
