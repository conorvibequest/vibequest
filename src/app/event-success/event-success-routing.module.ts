import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventSuccessPage } from './event-success.page';

const routes: Routes = [
  {
    path: '',
    component: EventSuccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventSuccessPageRoutingModule {}
