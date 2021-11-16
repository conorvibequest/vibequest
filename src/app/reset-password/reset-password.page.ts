import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { UserDto } from '../account/models/userDto';
import { LoginService } from '../account/services/login.service';
import { StorageHelper } from '../shared/storage-helper';
import { ToastHelper } from '../shared/toast-helper';
import { PasswordValidator } from './password.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  resetPasswordForm: FormGroup;
  matching_passwords_group: FormGroup;
  isSubmitted: boolean = false;
  email: string;
  validation_messages = {
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' }
    ],
    'matching_passwords': [
      { type: 'areNotEqual', message: 'Password mismatch' }
    ]
  };

  constructor(public router: Router,
    public loginService: LoginService,
    public storageService: StorageHelper,
    public toast: ToastHelper,
    public loading: LoadingController) {
    if (history.state && history.state.email) {
      this.email = history.state.email;
    }

    this.matching_passwords_group = new FormGroup({
      'password': new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      'confirm_password': new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areNotEqual(formGroup);
    });

    this.resetPasswordForm = new FormGroup({
      'matching_passwords': this.matching_passwords_group
    });
  }

  ngOnInit() {
  }

  async onClickSubmit() {
    this.isSubmitted = true;
    if (!this.resetPasswordForm.valid) {
      return;
    }

    let request = {
      email: this.email,
      password: this.matching_passwords_group.value.password
    } as UserDto

    const loading = await this.loading.create({
      message: '',
      spinner:'dots'
    });

    loading.present();
    this.loginService.resetPassword(request).subscribe((data) => {
      if (data != null) {
        loading.dismiss();
        this.toast.presentToast("New password created successfully!");
        this.router.navigate(['/login']);
      }
    }, error => {
      this.toast.presentToast(error.error.message);
      loading.dismiss();
    })
  }

}
