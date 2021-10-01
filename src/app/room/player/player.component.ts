import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, of } from 'rxjs';
import { switchMap, first, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {

  @Input() player: any;

  constructor(public db: AngularFireDatabase) { }

  ngOnInit() {
    this.db.object(`players/${this.player.key}`).valueChanges().subscribe(user => {
      console.log(user);
    })
  }

}
