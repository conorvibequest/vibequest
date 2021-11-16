import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationModalPageRoutingModule } from './location-modal-routing.module';

import { LocationModalPage } from './location-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationModalPageRoutingModule
  ],
  declarations: [LocationModalPage]
})
export class LocationModalPageModule {}
