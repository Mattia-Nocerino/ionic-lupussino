import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo  } from '@angular/fire/compat/auth-guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate: [AngularFireAuthGuard], 
    data: { authGuardPipe: () => redirectLoggedInTo(['rooms']) }
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule),
    canActivate: [AngularFireAuthGuard], 
    data: { authGuardPipe: () => redirectLoggedInTo(['rooms']) }
  },
  {
    path: 'rooms',
    loadChildren: () => import('./rooms/rooms.module').then( m => m.RoomsPageModule),
    canActivate: [AngularFireAuthGuard], 
    data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) }
  },
  {
    path: 'room/:id',
    loadChildren: () => import('./room/room.module').then( m => m.RoomPageModule),
    canActivate: [AngularFireAuthGuard], 
    data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) }
  },
  {
    path: '',
    redirectTo: 'rooms',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
