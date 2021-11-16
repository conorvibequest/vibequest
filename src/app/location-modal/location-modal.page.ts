import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

@Component({
  selector: 'app-location-modal',
  templateUrl: './location-modal.page.html',
  styleUrls: ['./location-modal.page.scss'],
})
export class LocationModalPage implements OnInit {

  places = [];
  searchKey: string = '';
  searchedPlace: any;
  isFromCurrentLocation: boolean = false;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  async search() {
    if (this.searchKey == '') {
      this.places = [];
    } else {
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query: this.searchKey });
      this.places = results;
    }
  }

  onClickPickAddress(place) {
    this.places = [];
    this.searchKey = '';
    this.searchedPlace = place;
    this.dismiss();
  }

  dismiss() {
    this.modalController.dismiss({ searchedLocation: this.searchedPlace, isFromCurrentLocation: this.isFromCurrentLocation });
  }

  onClickCurrentLocation() {
    this.isFromCurrentLocation = true;
    this.dismiss();
  }
}
