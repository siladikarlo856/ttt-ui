import type { CreatePlayerDto } from "~/types";

export const usePlayersService = () => {
  function createPlayer(player: CreatePlayerDto) {
    return useFetch("/api/players", {
      server: false,
      method: "POST",
      body: JSON.stringify(player),
      onRequest({ options }) {
        options.headers = options.headers || {};
        (options.headers as Record<string, string>).authorization =
          "Bearer " + useCookie("accessToken").value;
      },
    });
  }

  return {
    createPlayer,
  };
};
