import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, zip } from 'rxjs';
import { concatMap, mergeAll, mergeMap, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {
  room: any;
  players: any;
  currentPlayer: any;

  constructor(private route: ActivatedRoute, private db: AngularFireDatabase, public authService: AuthService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      //JOIN ROOM
      this.authService.getUser.then(user => {
        this.db.object(`players/${user.uid}`).update({room: params.get('id')});
        this.db.object(`players/${user.uid}`).valueChanges().subscribe(player => this.currentPlayer = player);
      })

      //GET ROOM
      this.db.object(`rooms/${params.get('id')}`).valueChanges().subscribe(room => this.room = room);

      //GET PLAYERS
      this.db.list('players', ref => ref.orderByChild('room').equalTo(params.get('id'))).valueChanges().subscribe(players => this.players = players);
    })
  }

  newGame(){}
}
