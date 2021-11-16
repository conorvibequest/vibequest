import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventAttendingFriendsListPage } from './event-attending-friends-list.page';

const routes: Routes = [
  {
    path: '',
    component: EventAttendingFriendsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventAttendingFriendsListPageRoutingModule {}
