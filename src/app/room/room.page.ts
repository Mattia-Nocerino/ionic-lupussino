import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {
  room$: Observable<any>;
  players$: Observable<any>;

  constructor(private route: ActivatedRoute, private db: AngularFireDatabase, public authService: AuthService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      //JOIN ROOM
      this.authService.getUser.then(user => {
        this.db.object(`players/${user.uid}`).update({room: params.get('id')})
      })

      //GET ROOM
      this.room$ = this.db.object(`rooms/${params.get('id')}`).valueChanges();

      //GET PLAYERS
      this.players$ = this.db.list('players', ref => ref.orderByChild('room').equalTo(params.get('id'))).valueChanges();
    });
  }

}
