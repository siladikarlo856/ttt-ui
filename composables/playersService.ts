import type { CreatePlayerDto } from "~/types";

export const usePlayersService = () => {
  function createPlayer(player: CreatePlayerDto) {
    return useAuthFetch("/api/players", {
      server: false,
      method: "POST",
      body: JSON.stringify(player),
    });
  }

  return {
    createPlayer,
  };
};
