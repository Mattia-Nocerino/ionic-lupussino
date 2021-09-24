import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<firebase.User|null>;

  constructor(private auth: AngularFireAuth) {
    this.user$ = this.auth.user;
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
    } catch(error) {
      throw error;
    }
  }

  loginWithGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider);
  }

  register(email: string, password: string) {
    this.auth.createUserWithEmailAndPassword(email, password);
  }

  forgotPassword(email: string) {
    this.auth.sendPasswordResetEmail(email);
  }

  logout() {
    this.auth.signOut();
  }
}
