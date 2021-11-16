import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventSuccessPageRoutingModule } from './event-success-routing.module';

import { EventSuccessPage } from './event-success.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventSuccessPageRoutingModule
  ],
  declarations: [EventSuccessPage]
})
export class EventSuccessPageModule {}
