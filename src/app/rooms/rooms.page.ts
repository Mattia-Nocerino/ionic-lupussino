import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements OnInit {
  rooms$: Observable<any[]>;
  newRoomName: string = '';


  constructor(private db: AngularFireDatabase, public authService: AuthService, private router: Router) { 
    this.rooms$ = db.list('rooms').valueChanges();
  }

  ngOnInit() {
  }

  async createRoom() {
    await this.db.object(`rooms/${this.newRoomName}`).set({ 
      name: this.newRoomName, 
      playersCount: 1, 
      gamesCount: 0,
    })
    this.router.navigateByUrl(`room/${this.newRoomName}`);
  }

}
