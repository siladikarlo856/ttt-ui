import { http, HttpResponse } from "msw";

export const handlers = [
  // http.get("http://localhost:8080/api/statistics/years", () => {
  //   return HttpResponse.json([
  //     { value: 2024, label: "2024" },
  //     { value: 2023, label: "2023" },
  //     { value: 2022, label: "2022" },
  //   ]);
  // }),

  http.get("http://localhost:8080/api/statistics", () => {
    return HttpResponse.json({});
  }),
];
