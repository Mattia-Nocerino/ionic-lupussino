import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Observable, of } from 'rxjs';
import { switchMap, first, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<any>;

  constructor(private auth: AngularFireAuth, private db: AngularFireDatabase, private router: Router) {
    this.user$ = this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.object(`players/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );

    this.updateOnUser().subscribe();
    this.updateOnDisconnect().subscribe();
    this.updateOnAway();
  }

  get getUser() {
    return this.auth.authState.pipe(first()).toPromise();
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
      this.router.navigateByUrl('rooms');
    } catch(error) {
      throw error;
    }
  }

  async loginWithGoogle() {
    try {
      const res = await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider);
      if (res.additionalUserInfo.isNewUser) {
        this.db.object(`players/${res.user.uid}`).set({
          displayName: res.user.displayName,
          status: 'online',
          key: res.user.uid
        })
      }
      this.router.navigateByUrl('rooms');
    } catch(error) {
      throw error;
    }
  }

  async register(email: string, password: string, displayName: string) {
    try {
      const res = await this.auth.createUserWithEmailAndPassword(email, password);
      this.db.object(`players/${res.user.uid}`).set({
        displayName,
        status: 'online',
        key: res.user.uid
      })
      this.router.navigateByUrl('rooms');
    } catch(error) {
      throw error;
    }
  }

  forgotPassword(email: string) {
    this.auth.sendPasswordResetEmail(email);
  }

  async logout() {
    await this.auth.signOut();
    await this.setPresence('offline');
  }

  async setPresence(status: string) {
    const user = await this.getUser;
    if (user) {
      return this.db.object(`players/${user.uid}`).update({ status })
    }
  }

  updateOnUser() {
    const connection = this.db.object('.info/connected').valueChanges().pipe(
      map(connected => connected ? 'online' : 'offline')
    )

    return this.auth.authState.pipe(
      switchMap(user => user ? connection : of('offline')),
      tap(status => this.setPresence(status))
    )
  }

  updateOnAway() {
    document.onvisibilitychange = (e) => {
      if(document.visibilityState === 'hidden') {
        this.setPresence('away');
      } else {
        this.setPresence('online');
      }
    }
  }

  updateOnDisconnect() {
    return this.auth.authState.pipe(
      tap(user => {
        if (user) {
          this.db.object(`players/${user.uid}`).query.ref.onDisconnect().update({ status: 'offline' })
        }
      })
    )
  }
}
