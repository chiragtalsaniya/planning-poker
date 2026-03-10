import { Routes } from '@angular/router';
import { JoinComponent } from './components/join/join.component';
import { RoomComponent } from './components/room/room.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  { path: '', component: JoinComponent },
  { path: 'room', component: RoomComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' }
];
