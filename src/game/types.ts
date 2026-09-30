export type MatchEndReason =
  | "time"
  | "player";

export interface MatchRecord {
  id: string;

  playerName: string;

  score: number;

  reason: MatchEndReason;

  duration: number;

  remainingTime: number;

  endedAt: string;
}

export interface CreateMatchInput {
  playerName: string;

  score: number;

  reason: MatchEndReason;

  duration: number;

  remainingTime: number;

  endedAt: string;
}

export interface RankingEntry {
  rank: number;

  playerName: string;

  score: number;

  endedAt: string;
}