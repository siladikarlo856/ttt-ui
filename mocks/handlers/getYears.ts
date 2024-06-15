import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("http://localhost:8080/api/statistics/years", () => {
    return HttpResponse.json(["2024", "2023", "2022"]);
  }),
];
