import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { StorageHelper } from 'src/app/shared/storage-helper';
import { ToastHelper } from 'src/app/shared/toast-helper';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  forgotPasswordForm: FormGroup;
  isSubmitted: boolean = false;
  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ]
  };

  constructor(public router: Router,
    public loginService: LoginService,
    public toast: ToastHelper,
    public storageService: StorageHelper,
    public loading: LoadingController) {
    this.forgotPasswordForm = new FormGroup({
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }

  ngOnInit() {
  }

  async onClickSendOtp() {
    this.isSubmitted = true;
    if (!this.forgotPasswordForm.valid) {
      return;
    }
    const loading = await this.loading.create({
      message: '',
      spinner:'dots'
    });

    loading.present();
    this.loginService.getForgotPasswordEmail(this.forgotPasswordForm.value.email).subscribe((data) => {
      if (data == true) {
        this.isSubmitted = false;
        loading.dismiss();
        this.router.navigate(['/email-confirmation'], { state: { email: this.forgotPasswordForm.value.email } })
      }
      else {
        loading.dismiss();
        this.toast.presentToast("OTP has been sent to your email address.");
      }
    }, error => { this.toast.presentToast(error.error.message) })
    // this.router.navigate(['/email-confirmation'], { state: { email: this.forgotPasswordForm.value.email } })
  }
}
