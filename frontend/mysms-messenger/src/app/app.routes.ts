import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { authGuard } from './guards/auth.guard';
import { MessengerComponent } from './components/messenger/messenger.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'messages',
    pathMatch: 'full'
  },
  {
    path: 'messages',
    component: MessengerComponent,
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: '**',
    redirectTo: 'messages'
  }
];
