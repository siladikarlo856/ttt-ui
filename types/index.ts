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
