import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { StorageKeys } from '../shared/config/constants';
import { StorageHelper } from '../shared/storage-helper';
import { InterestDto } from './models/interestDto';
import { InterestService } from './services/interest.service';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.page.html',
  styleUrls: ['./interest.page.scss'],
})
export class InterestPage implements OnInit {

  interests: InterestDto[] = [];
  isCheckboxDisabled: boolean = false;
  win: any = window;
  selectCount: number = 0;
  selectedInterests: any[] = [];
  userId: string;
  loadingController: any;
  name: string;

  constructor(
    public interestService: InterestService,
    public storageService: StorageHelper,
    public loading: LoadingController,
    public router: Router,
    public navCtrl:NavController) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.loadingController = await this.loading.create({
      message: '',
      spinner:'dots'
    });

    this.loadingController.present();
    this.storageService.get(StorageKeys.user).then((data) => {
      if (data) {
        this.userId = data.id;
        this.name = data.firstName + " " + data.lastName;
      }
    });
    setTimeout(() => {
      this.getInterests();
    }, 1000);
  }

  getInterests() {
    this.interestService.getInterests().subscribe((data: InterestDto[]) => {
      this.interests = data;
      this.loadingController.dismiss();
    }, (error) => { this.loadingController.dismiss() });
  }

  checked(interest: InterestDto) {
    if (interest.checked === true) {
      this.selectCount++;
      this.selectedInterests.push(interest.id);
    } else if (interest.checked === false) {
      this.selectCount--;
      this.selectedInterests.splice(this.selectedInterests.indexOf(interest.id), 1);
    }
  }

  public disableCheckbox(id): boolean {
    return this.selectedInterests.length == 4 && !this.selectedInterests.includes(id);
  }

  async onClickContinue() {
    this.loadingController = await this.loading.create({
      message: '',
      spinner:'dots'
    });

    this.loadingController.present();
    this.interestService.insertInterests(this.userId, this.selectedInterests).subscribe(() => {
      this.loadingController.dismiss();
      this.navCtrl.navigateRoot('/app');
    })
  }
}
