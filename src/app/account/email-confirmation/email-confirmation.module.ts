import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailConfirmationPageRoutingModule } from './email-confirmation-routing.module';

import { EmailConfirmationPage } from './email-confirmation.page';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmailConfirmationPageRoutingModule,
    NgOtpInputModule
  ],
  declarations: [EmailConfirmationPage]
})
export class EmailConfirmationPageModule {}
