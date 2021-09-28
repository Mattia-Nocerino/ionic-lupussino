import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    displayName: new FormControl('', [Validators.required]),
  })

  constructor(public authService: AuthService, public toastController: ToastController) { }

  ngOnInit() {
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get displayName() {
    return this.form.get('displayName');
  }

  async register() {
    if (this.form.valid) {
      try {
        const res = await this.authService.register(this.email.value, this.password.value, this.displayName.value);
      } catch(error) {

        let customMessage: string;
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password': customMessage = 'Email o password errati';
            break;
          default: customMessage = 'Errore imprevisto. Riprova più tardi';
        }
        const toast = await this.toastController.create({
          message: customMessage,
          duration: 2000
        });
        toast.present();
      }
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

}
