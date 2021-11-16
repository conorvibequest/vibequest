import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth-guard';
import { LoginAuthGuard } from './shared/guards/login-auth-guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  // {
  //   path: '',
  //   redirectTo: 'landing',
  //   pathMatch: 'full'
  // },
  {
    path: 'login',
    loadChildren: () => import('./account/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingPageModule),
    canActivate: [LoginAuthGuard]
  },
  {
    path: 'interest',
    loadChildren: () => import('./interest/interest.module').then(m => m.InterestPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./account/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./account/sign-up/sign-up.module').then(m => m.SignUpPageModule)
  },
  {
    path: 'new-event',
    loadChildren: () => import('./new-event/new-event.module').then(m => m.NewEventPageModule)
  },
  {
    path: 'event-details',
    loadChildren: () => import('./event-details/event-details.module').then(m => m.EventDetailsPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: 'add-friends',
    loadChildren: () => import('./add-friends/add-friends.module').then( m => m.AddFriendsPageModule)
  },  
  {
    path: 'event-success',
    loadChildren: () => import('./event-success/event-success.module').then( m => m.EventSuccessPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'event-attending-friends-list',
    loadChildren: () => import('./event-attending-friends-list/event-attending-friends-list.module').then( m => m.EventAttendingFriendsListPageModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'new-event',
    loadChildren: () => import('./new-event/new-event.module').then(m => m.NewEventPageModule)
  },
  {
    path: 'event-details',
    loadChildren: () => import('./event-details/event-details.module').then(m => m.EventDetailsPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: 'add-friends',
    loadChildren: () => import('./add-friends/add-friends.module').then( m => m.AddFriendsPageModule)
  },  
  {
    path: 'event-success',
    loadChildren: () => import('./event-success/event-success.module').then( m => m.EventSuccessPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'email-confirmation',
    loadChildren: () => import('./account/email-confirmation/email-confirmation.module').then( m => m.EmailConfirmationPageModule)
  },
  {
    path: 'event-attending-friends-list',
    loadChildren: () => import('./event-attending-friends-list/event-attending-friends-list.module').then( m => m.EventAttendingFriendsListPageModule)
  },
  {
    path: 'invite-friends',
    loadChildren: () => import('./invite-friends/invite-friends.module').then( m => m.InviteFriendsPageModule)
  },
  {
    path: 'edit-interest',
    loadChildren: () => import('./edit-interest/edit-interest.module').then( m => m.EditInterestPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'search-event',
    loadChildren: () => import('./search-event/search-event.module').then( m => m.SearchEventPageModule)
  },
  {
    path: 'permission',
    loadChildren: () => import('./permission/permission.module').then( m => m.PermissionPageModule)
  },
  {
    path: 'location-modal',
    loadChildren: () => import('./location-modal/location-modal.module').then( m => m.LocationModalPageModule)
  }




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
