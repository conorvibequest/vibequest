import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchEventPage } from './search-event.page';

const routes: Routes = [
  {
    path: '',
    component: SearchEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchEventPageRoutingModule {}
