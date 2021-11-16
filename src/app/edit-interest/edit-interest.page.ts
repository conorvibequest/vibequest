import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { InterestDto } from '../interest/models/interestDto';
import { InterestService } from '../interest/services/interest.service';
import { StorageKeys } from '../shared/config/constants';
import { StorageHelper } from '../shared/storage-helper';

@Component({
  selector: 'app-edit-interest',
  templateUrl: './edit-interest.page.html',
  styleUrls: ['./edit-interest.page.scss'],
})
export class EditInterestPage implements OnInit {

  interests: InterestDto[] = [];
  isCheckboxDisabled: boolean = false;
  selectCount: number = 0;
  selectedInterests: any[] = [];
  userId: string;
  loadingController: any;
  name: string;
  userCategories: any[] = []

  constructor(public interestService: InterestService,
    public storageService: StorageHelper,
    public loading: LoadingController,
    public router: Router,
    public ref:ChangeDetectorRef) { }

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
    if (history.state && history.state.categories) {
      this.userCategories = history.state.categories;
      this.selectedInterests = [];
      for (let i = 0; i < this.userCategories.length; i++) {
        this.selectedInterests.push(this.userCategories[i].id);
      }
      this.selectCount = this.selectedInterests.length;
    }
    setTimeout(() => {
      this.getInterests();
    }, 1000);
  }

  getInterests() {
    this.interestService.getInterests().subscribe((data: InterestDto[]) => {
      this.interests = data;
      this.loadingController.dismiss();
      for (let i = 0; i < this.interests.length; i++) {
        for (let j = 0; j < this.selectedInterests.length; j++) {
          if (this.interests[i].id == this.selectedInterests[j]) {
            this.interests[i].checked = true;
          }
        }
      }
    }, (error) => { this.loadingController.dismiss() });
  }

  checked(interest: InterestDto) {
    if (interest.checked === true) {
     var interestId = this.selectedInterests.filter(x => x == interest.id)
     if(interestId == null || interestId.length == 0)
     {
      this.selectCount++;
      this.selectedInterests.push(interest.id);
     }
     
    } else if (interest.checked === false) {
      this.selectCount--;
      this.selectedInterests.splice(this.selectedInterests.indexOf(interest.id), 1);
    }
  }

  public disableCheckbox(id): boolean {
    return this.selectedInterests.length == 4 && !this.selectedInterests.includes(id);
  }

  async onClickSave() {
    this.loadingController = await this.loading.create({
      message: '',
      spinner:'dots'
    });

    this.loadingController.present();
    this.interestService.updateUserInterest(this.userId, this.selectedInterests).subscribe(() => {
      this.loadingController.dismiss();
      this.redirectTo();
    })
  }

  redirectTo(){
    this.router.navigateByUrl('/app/events', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/app/profile']));
  }

}
