import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements OnInit {
  rooms$: Observable<any[]>;
  newRoomName: string = '';


  constructor(private db: AngularFireDatabase) { 
    this.rooms$ = db.list('rooms').valueChanges();
  }

  ngOnInit() {
  }

  createRoom() {
    this.db.object('rooms/'+this.newRoomName).set({ 
      name: this.newRoomName, 
      playerCount: 1, 
    })
  }

}
