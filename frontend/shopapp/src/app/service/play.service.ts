import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private trackStartedSource = new Subject<{ trackTitle: string, singerName: string }>();
  trackStarted$ = this.trackStartedSource.asObservable();

  startTrack(trackTitle: string, singerName: string) {
    this.trackStartedSource.next({ trackTitle, singerName });
  }
}