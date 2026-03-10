import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { RoomState, RevealedVotes } from '../models/poker.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private readonly SERVER_URL = environment.apiUrl;

  constructor() {
    this.socket = io(this.SERVER_URL);
  }

  joinRoom(roomId: string, userName: string, isCreator: boolean): void {
    this.socket.emit('join-room', { roomId, userName, isCreator });
  }

  castVote(roomId: string, vote: string): void {
    this.socket.emit('cast-vote', { roomId, vote });
  }

  requestReveal(roomId: string, userName: string): void {
    this.socket.emit('request-reveal', { roomId, userName });
  }

  revealVotes(roomId: string): void {
    this.socket.emit('reveal-votes', { roomId });
  }

  resetVotes(roomId: string): void {
    this.socket.emit('reset-votes', { roomId });
  }

  updateStory(roomId: string, storyTitle: string): void {
    this.socket.emit('update-story', { roomId, storyTitle });
  }

  onJoined(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('joined', (data) => observer.next(data));
    });
  }

  onJoinError(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('join-error', (data) => observer.next(data));
    });
  }

  onRoomUpdate(): Observable<RoomState> {
    return new Observable(observer => {
      this.socket.on('room-update', (data) => observer.next(data));
    });
  }

  onVoteConfirmed(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('vote-confirmed', (data) => observer.next(data));
    });
  }

  onVotesRevealed(): Observable<RevealedVotes> {
    return new Observable(observer => {
      this.socket.on('votes-revealed', (data) => observer.next(data));
    });
  }

  onVotesReset(): Observable<RoomState> {
    return new Observable(observer => {
      this.socket.on('votes-reset', (data) => observer.next(data));
    });
  }

  onStoryUpdated(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('story-updated', (data) => observer.next(data));
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
