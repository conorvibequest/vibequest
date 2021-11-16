import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditInterestPageRoutingModule } from './edit-interest-routing.module';

import { EditInterestPage } from './edit-interest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditInterestPageRoutingModule
  ],
  declarations: [EditInterestPage]
})
export class EditInterestPageModule {}
