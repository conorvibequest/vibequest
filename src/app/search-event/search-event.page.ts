import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { StorageKeys } from '../shared/config/constants';
import { StorageHelper } from '../shared/storage-helper';
import { KeyboardHelper } from 'src/app/shared/keyboard-helper'

@Component({
  selector: 'app-search-event',
  templateUrl: './search-event.page.html',
  styleUrls: ['./search-event.page.scss'],
})
export class SearchEventPage implements OnInit {

  searchTerm: string = '';
  eventList: any[];
  alleventsList: any[];
  userId: string;
  isSearchEventEmpty: boolean = false;
  constructor(public storageService: StorageHelper,
    private platform: Platform,
    private router: Router,
    public keyBoardHelper: KeyboardHelper) {

  }


  ionViewDidEnter() {
    if (history.state && history.state.events) {
      this.alleventsList = history.state.events;
      this.filterEvents();
      this.storageService.get(StorageKeys.user).then((data) => {
        if (data) {
          this.userId = data.id;
        }
      });
    }
  }

  filterEvents() {

    if (this.searchTerm.length > 0) {
      this.eventList = this.alleventsList.filter((x) => {
        return x.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
      });
      if (this.eventList.length == 0) {
        this.isSearchEventEmpty = true;
      }
      else {
        this.isSearchEventEmpty = false;
      }
    }
    else if (this.searchTerm.length == 0) {
      this.isSearchEventEmpty = false;
      this.eventList = [];
    }
    console.log(this.eventList, 'Events')
  }

  ngOnInit() {
  }

  backRedirect() {
    this.router.navigateByUrl('/app/events', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/app/home']));
  }

  closeKeyboard(event) {
    if (event && event.key === "Enter") {
      this.keyBoardHelper.closeKeyboard();
    }
  }

}
