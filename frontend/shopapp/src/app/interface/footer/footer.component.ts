import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { PlayerService } from '../../service/play.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() selectedTrack: any;
  @Input() tracks: any[] = [];
  @Input() track: any; 
  @Output() trackChange = new EventEmitter<any>();
  @ViewChild('audioPlayer', { static: false }) audioPlayerRef: ElementRef<HTMLAudioElement> | undefined;
  @Output() playingStatusChange = new EventEmitter<boolean>();
  volume: number = 1; // Thêm thuộc tính volume
  currentTrackIndex: number = 0;
  isPlaying = false;
  progress = 0;
  currentTime = '0:00';
  totalTime = '0:00';

  private audioElement: HTMLAudioElement | null = null;
  constructor(
    private playerService: PlayerService, // Inject PlayerService
    private userService: UserService // Inject UserService
  ) {
    this.playerService.trackStarted$.subscribe(({ trackTitle, singerName }) => {
      this.userService.addToHistory(trackTitle, singerName);
      // ... Logic xử lý phát nhạc, ví dụ: this.loadAudio() ...
    });
  }
  ngOnInit() {
    this.updateCurrentTrackIndex();
  }

  ngAfterViewInit() {
    if (this.audioPlayerRef) {
      this.audioElement = this.audioPlayerRef.nativeElement;
      this.initializeAudioPlayer();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['selectedTrack'] && !changes['selectedTrack'].firstChange) || 
        (changes['track'] && !changes['track  '].firstChange)) {
      this.updateCurrentTrackIndex();
      this.loadAudio();
    }
  }

  ngOnDestroy() {
    if (this.audioElement) {
      this.audioElement.removeEventListener('timeupdate', this.onTimeUpdate);
      this.audioElement.removeEventListener('loadedmetadata', this.onLoadedMetadata);
    }
  }

  private initializeAudioPlayer() {
    if (this.audioElement) {
      this.audioElement.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
      this.audioElement.addEventListener('loadedmetadata', this.onLoadedMetadata.bind(this));
      this.loadAudio();
    }
  }

  private updateCurrentTrackIndex() {
    if (this.selectedTrack && this.tracks.length > 0) {
      this.currentTrackIndex = this.tracks.findIndex(track => track.id === this.selectedTrack.id);
      if (this.currentTrackIndex === -1) this.currentTrackIndex = 0;
    }
  }

  private loadAudio() {
    if (this.audioElement) {
      const trackToPlay = this.track || this.selectedTrack; 

      if (trackToPlay) {
        this.audioElement.src = trackToPlay.fileUrl;
        this.audioElement.load();
        this.isPlaying = false;
      }
    }
  }
  get isMuted(): boolean {
    return this.audioElement ? this.audioElement.muted : false;
  }
  playPause() {
    if (this.audioElement) {
      if (this.isPlaying) {
        this.audioElement.pause();
      } else {
        this.audioElement.play();
      }
      this.isPlaying = !this.isPlaying;
      this.playingStatusChange.emit(this.isPlaying);

      // Cập nhật lịch sử nghe nhạc khi bắt đầu phát nhạc
      if (this.isPlaying && this.selectedTrack) { 
        this.userService.addToHistory(this.selectedTrack.title, this.selectedTrack.singer.name); 
      }
    }
  }

  prevTrack() {
    if (this.tracks.length > 0) {
      this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
      this.selectedTrack = this.tracks[this.currentTrackIndex];
      this.trackChange.emit(this.selectedTrack);
      this.loadAudio();
      if (this.isPlaying) this.playPause();
    }
  }

  nextTrack() {
    if (this.tracks.length > 0) {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
      this.selectedTrack = this.tracks[this.currentTrackIndex];
      this.trackChange.emit(this.selectedTrack);
      this.loadAudio();
      if (this.isPlaying) this.playPause();
    }
  }

  updateProgress(event: Event) {
    if (this.audioElement) {
      const value = (event.target as HTMLInputElement).value;
      this.audioElement.currentTime = (parseFloat(value) / 100) * this.audioElement.duration;
      this.progress = parseFloat(value);
    }
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  private onTimeUpdate() {
    if (this.audioElement) {
      this.currentTime = this.formatTime(this.audioElement.currentTime);
      this.progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;
    }
  }

  private onLoadedMetadata() {
    if (this.audioElement) {
      this.totalTime = this.formatTime(this.audioElement.duration);
    }
  }
  updateVolume(event: Event) {
    if (this.audioElement) {
      const value = (event.target as HTMLInputElement).value;
      this.volume = parseFloat(value);
      this.audioElement.volume = this.volume;
    }
  }

  toggleMute() {
    if (this.audioElement) {
      this.audioElement.muted = !this.audioElement.muted;
    }
  }
}