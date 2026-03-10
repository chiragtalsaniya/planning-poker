import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { RoomState, RevealedVotes, POKER_CARDS, Vote } from '../../models/poker.model';
import { PokerCardComponent, PokerCardConfig } from '../poker-card/poker-card.component';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule, FormsModule, PokerCardComponent],
  templateUrl: './room.component.html'
})
export class RoomComponent implements OnInit, OnDestroy {
  roomState: RoomState | null = null;
  revealedVotes: Vote[] = [];
  voteStats: any = null;
  myVote: string | null = null;
  isCreator = false;
  userName = '';
  roomId = '';
  pokerCards = POKER_CARDS;
  sessionUrl = '';
  qrCodeUrl = '';
  linkCopied = false;
  storyTitle = '';
  showConfirmDialog = false;
  confirmTitle = '';
  confirmMessage = '';
  confirmCallback: (() => void) | null = null;
  flippedCards: Set<number> = new Set();
  flippedStats: Set<string> = new Set();

  constructor(
    private socketService: SocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const isCreator = localStorage.getItem('isCreator');
    this.userName = localStorage.getItem('userName') || '';
    this.roomId = localStorage.getItem('roomId') || '';
    
    if (!this.userName || !this.roomId) {
      this.router.navigate(['/']);
      return;
    }

    this.isCreator = isCreator === 'true';

    this.sessionUrl = `${window.location.origin}/planning-poker?room=${this.roomId}`;
    this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(this.sessionUrl)}`;

    this.socketService.onRoomUpdate().subscribe((state) => {
      this.roomState = state;
      this.storyTitle = state.storyTitle;
      if (!state.isRevealed) {
        this.revealedVotes = [];
        this.voteStats = null;
      }
    });

    this.socketService.onVoteConfirmed().subscribe((data) => {
      this.myVote = data.vote;
    });

    this.socketService.onVotesRevealed().subscribe((data: RevealedVotes) => {
      this.revealedVotes = data.votes;
      this.voteStats = data.stats;
      this.roomState = data.state;
      this.flippedCards.clear();
      this.flippedStats.clear();
      this.animateCardFlips();
      this.animateStatsFlips();
    });

    this.socketService.onVotesReset().subscribe((state) => {
      this.roomState = state;
      this.myVote = null;
      this.revealedVotes = [];
      this.voteStats = null;
    });

    this.socketService.onStoryUpdated().subscribe((data) => {
      this.storyTitle = data.storyTitle;
      this.roomState = data.state;
    });
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  selectCard(card: string): void {
    this.myVote = card;
    this.socketService.castVote(this.roomId, card);
  }

  revealVotes(): void {
    this.showConfirm(
      'Reveal Votes',
      'Are you sure you want to reveal all votes?',
      () => this.socketService.revealVotes(this.roomId)
    );
  }

  resetVotes(): void {
    this.showConfirm(
      'Reset Votes',
      'Are you sure you want to reset all votes? This will clear the current voting round.',
      () => this.socketService.resetVotes(this.roomId)
    );
  }

  updateStory(): void {
    this.socketService.updateStory(this.roomId, this.storyTitle);
  }

  getVoteColor(vote: string): string {
    if (!this.voteStats?.voteCounts) return '';
    const count = this.voteStats.voteCounts[vote];
    if (count > 1) {
      const colors = ['bg-blue-100 border-blue-400', 'bg-green-100 border-green-400', 'bg-purple-100 border-purple-400', 'bg-yellow-100 border-yellow-400'];
      const index = Object.keys(this.voteStats.voteCounts).indexOf(vote) % colors.length;
      return colors[index];
    }
    return 'bg-gray-100 border-gray-300';
  }

  getVotingPercentage(): number {
    if (!this.roomState || this.roomState.totalUsers === 0) return 0;
    return Math.round((this.roomState.votedCount / this.roomState.totalUsers) * 100);
  }

  getRemainingVotes(): number {
    if (!this.roomState) return 0;
    return this.roomState.totalUsers - this.roomState.votedCount;
  }

  requestReveal(): void {
    this.socketService.requestReveal(this.roomId, this.userName);
  }

  canReveal(): boolean {
    return this.isCreator && this.roomState !== null && this.roomState.votedCount > 0 && !this.roomState.isRevealed;
  }

  canReset(): boolean {
    return this.isCreator && this.roomState !== null && (this.roomState.votedCount > 0 || this.roomState.isRevealed);
  }

  leaveRoom(): void {
    this.showConfirm(
      'Leave Session',
      'Are you sure you want to leave this session?',
      () => {
        this.socketService.disconnect();
        this.resetComponentState();
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/']);
      }
    );
  }

  private resetComponentState(): void {
    this.roomState = null;
    this.revealedVotes = [];
    this.voteStats = null;
    this.myVote = null;
    this.userName = '';
    this.roomId = '';
    this.sessionUrl = '';
    this.qrCodeUrl = '';
    this.linkCopied = false;
    this.storyTitle = '';
    this.flippedCards.clear();
    this.flippedStats.clear();
  }

  showConfirm(title: string, message: string, callback: () => void): void {
    this.confirmTitle = title;
    this.confirmMessage = message;
    this.confirmCallback = callback;
    this.showConfirmDialog = true;
  }

  acceptConfirm(): void {
    if (this.confirmCallback) {
      this.confirmCallback();
    }
    this.showConfirmDialog = false;
    this.confirmCallback = null;
  }

  cancelConfirm(): void {
    this.showConfirmDialog = false;
    this.confirmCallback = null;
  }

  copySessionLink(): void {
    navigator.clipboard.writeText(this.sessionUrl);
    this.linkCopied = true;
    setTimeout(() => this.linkCopied = false, 2000);
  }

  getVoteDistribution(): Array<{vote: string, count: number, percentage: number}> {
    if (!this.voteStats?.voteCounts) return [];
    
    const total = this.revealedVotes.length;
    return Object.entries(this.voteStats.voteCounts)
      .map(([vote, count]) => ({
        vote,
        count: count as number,
        percentage: Math.round(((count as number) / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }

  animateCardFlips(): void {
    setTimeout(() => {
      this.revealedVotes.forEach((_, index) => {
        setTimeout(() => {
          this.flippedCards.add(index);
        }, index * 200);
      });
    }, 3000);
  }

  isCardFlipped(index: number): boolean {
    return this.flippedCards.has(index);
  }

  animateStatsFlips(): void {
    const stats = ['average', 'highest', 'lowest', 'total'];
    setTimeout(() => {
      stats.forEach((stat, index) => {
        setTimeout(() => {
          this.flippedStats.add(stat);
        }, index * 200);
      });
    }, 3000);
  }

  getUserCardType(user: any): 'waiting' | 'voted' {
    if (user.name === this.userName && this.myVote) {
      return 'voted';
    }
    return user.hasVoted ? 'voted' : 'waiting';
  }

  isStatFlipped(stat: string): boolean {
    return this.flippedStats.has(stat);
  }
}
