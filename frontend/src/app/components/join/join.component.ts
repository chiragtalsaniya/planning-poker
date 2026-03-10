import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './join.component.html'
})
export class JoinComponent implements OnInit {
  userName = '';
  roomId = '';
  errorMessage = '';

  constructor(
    private socketService: SocketService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.socketService.onJoined().subscribe((data) => {
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userName', this.userName);
      localStorage.setItem('roomId', this.roomId);
      localStorage.setItem('isCreator', data.isCreator ? 'true' : 'false');
      this.router.navigate(['/room']);
    });

    this.socketService.onJoinError().subscribe((error) => {
      this.errorMessage = error.message;
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['room']) {
        this.roomId = params['room'];
      }
    });
  }

  createSession(): void {
    this.errorMessage = '';
    
    if (!this.userName.trim()) {
      this.errorMessage = 'Name is required';
      return;
    }

    this.roomId = this.generateRoomId();
    this.socketService.joinRoom(this.roomId, this.userName.trim(), true);
  }

  joinSession(): void {
    this.errorMessage = '';
    
    if (!this.userName.trim()) {
      this.errorMessage = 'Name is required';
      return;
    }

    if (!this.roomId.trim()) {
      this.errorMessage = 'Session ID is required';
      return;
    }

    this.socketService.joinRoom(this.roomId.trim(), this.userName.trim(), false);
  }

  generateRoomId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
