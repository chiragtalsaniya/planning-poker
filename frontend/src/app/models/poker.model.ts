export interface User {
  id: string;
  name: string;
  isCreator: boolean;
  hasVoted?: boolean;
}

export interface RoomState {
  roomId: string;
  storyTitle: string;
  isRevealed: boolean;
  revealedByUserName: string | null;
  users: User[];
  votedCount: number;
  totalUsers: number;
  revealRequests?: string[];
}

export interface Vote {
  userId: string;
  userName: string;
  vote: string | null;
}

export interface VoteStats {
  average: string | null;
  highest: number | null;
  lowest: number | null;
  voteCounts: { [key: string]: number };
}

export interface RevealedVotes {
  votes: Vote[];
  stats: VoteStats;
  revealedBy: string;
  state: RoomState;
}

export const POKER_CARDS = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '∞', 'Coffee'];
