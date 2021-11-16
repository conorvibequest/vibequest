import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchEventPageRoutingModule } from './search-event-routing.module';

import { SearchEventPage } from './search-event.page';
import { PipeModule } from '../shared/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule,
    SearchEventPageRoutingModule
  ],
  declarations: [SearchEventPage]
})
export class SearchEventPageModule {}
