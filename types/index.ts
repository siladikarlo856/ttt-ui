import type { MatchType } from "~/utils/enums";

export interface SelectOption {
  value: string;
  label: string;
}

export interface MatchDto {
  id: string;
  date: string;
  type: MatchType;
  homePlayer: {
    id: string;
    label: string;
  };
  awayPlayer: {
    id: string;
    label: string;
  };
  homePlayerSetsWon: number;
  awayPlayerSetsWon: number;
  sets: {
    homePlayerPoints: number;
    awayPlayerPoints: number;
  }[];
}

export interface CreateMatchDto {
  date: string;
  homePlayerId: string;
  awayPlayerId: string;
  homePlayerSetsWon: number;
  awayPlayerSetsWon: number;
}

export interface StatisticsDto {
  wins: number;
  losses: number;
  winRatio: number;
  currentStreak: Streak;
}

export interface Streak {
  type: StreakType;
  length: number;
  startDate: string;
}

export type StreakType = "win" | "loss";
