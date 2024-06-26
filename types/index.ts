interface SelectOption {
  value: string;
  label: string;
}

interface CreateMatchDto {
  date: string;
  homePlayerId: string;
  awayPlayerId: string;
  homePlayerSetsWon: number;
  awayPlayerSetsWon: number;
}

interface StatisticsDto {
  wins: number;
  losses: number;
  winRatio: number;
  currentStreak: Streak;
}

interface Streak {
  type: StreakType;
  length: number;
  startDate: string;
}

type StreakType = "win" | "loss";
