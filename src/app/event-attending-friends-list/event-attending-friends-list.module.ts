import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventAttendingFriendsListPageRoutingModule } from './event-attending-friends-list-routing.module';

import { EventAttendingFriendsListPage } from './event-attending-friends-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventAttendingFriendsListPageRoutingModule
  ],
  declarations: [EventAttendingFriendsListPage]
})
export class EventAttendingFriendsListPageModule {}
