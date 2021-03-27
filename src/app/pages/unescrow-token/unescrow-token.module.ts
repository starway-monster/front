import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnescrowTokenComponent } from './unescrow-token.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { UnescrowTokenRoutingModule } from './usescrow-token-routing.module';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [UnescrowTokenComponent],
  imports: [
    CommonModule,
    SharedModule,
    ComponentsModule,
    UnescrowTokenRoutingModule,
    FormsModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class UnescrowTokenModule { }
