import type { Component } from "vue";
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
  date: string | null;
  homePlayerId: string | null;
  awayPlayerId: string | null;
  homePlayerSetsWon: number | null;
  awayPlayerSetsWon: number | null;
  sets: {
    homePlayerPoints: number;
    awayPlayerPoints: number;
  }[];
  type: MatchType | null;
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

export interface CreatePlayerDto {
  firstName: string;
  lastName: string;
}

export interface MenuGroup {
  name: string;
  menuItems: MenuItem[];
}

export interface MenuItem {
  icon: Component;
  label: string;
  route: string;
  children?: MenuItem[];
}
