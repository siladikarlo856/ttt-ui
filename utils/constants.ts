export enum MatchType {
  Friendly = "friendly",
  League = "league",
  Tournament = "tournament",
}

export const matchTypes: SelectOption[] = [
  { value: MatchType.Friendly, label: "Friendly" },
  { value: MatchType.League, label: "League" },
  { value: MatchType.Tournament, label: "Tournament" },
];
