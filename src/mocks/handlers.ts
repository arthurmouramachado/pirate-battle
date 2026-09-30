import {
  delay,
  http,
  HttpResponse,
} from "msw";

import type {
  CreateMatchInput,
  MatchRecord,
  RankingEntry,
} from "../game/types";

const STORAGE_KEY =
  "pirate-battle-matches";

function readMatches():
  MatchRecord[] {
  try {
    const value =
      localStorage.getItem(
        STORAGE_KEY,
      );

    if (!value) {
      return [];
    }

    return JSON.parse(
      value,
    ) as MatchRecord[];
  } catch {
    return [];
  }
}

function saveMatches(
  matches: MatchRecord[],
) {
  localStorage.setItem(
    STORAGE_KEY,

    JSON.stringify(matches),
  );
}

function getScenario(
  request: Request,
) {
  const url =
    new URL(
      request.url,
    );

  return url.searchParams.get(
    "scenario",
  );
}

export const handlers = [
  http.get(
    "/api/matches",

    async ({
      request,
    }) => {
      const scenario =
        getScenario(request);

      if (
        scenario === "slow"
      ) {
        await delay(2000);
      } else {
        await delay(250);
      }

      if (
        scenario === "error"
      ) {
        return HttpResponse.json(
          {
            message:
              "Failed to load match history.",
          },

          {
            status: 500,
          },
        );
      }

      if (
        scenario === "empty"
      ) {
        return HttpResponse.json(
          [],
        );
      }

      const matches =
        readMatches().sort(
          (a, b) =>
            new Date(
              b.endedAt,
            ).getTime() -
            new Date(
              a.endedAt,
            ).getTime(),
        );

      return HttpResponse.json(
        matches,
      );
    },
  ),

  http.get(
    "/api/ranking",

    async ({
      request,
    }) => {
      const scenario =
        getScenario(request);

      if (
        scenario === "slow"
      ) {
        await delay(2000);
      } else {
        await delay(250);
      }

      if (
        scenario === "error"
      ) {
        return HttpResponse.json(
          {
            message:
              "Failed to load ranking.",
          },

          {
            status: 500,
          },
        );
      }

      if (
        scenario === "empty"
      ) {
        return HttpResponse.json(
          [],
        );
      }

      const ranking:
        RankingEntry[] =
        readMatches()
          .sort(
            (a, b) =>
              b.score -
              a.score,
          )
          .slice(
            0,
            10,
          )
          .map(
            (
              match,
              index,
            ) => ({
              rank:
                index +
                1,

              playerName:
                match.playerName,

              score:
                match.score,

              endedAt:
                match.endedAt,
            }),
          );

      return HttpResponse.json(
        ranking,
      );
    },
  ),

  http.post(
    "/api/matches",

    async ({
      request,
    }) => {
      await delay(250);

      const body =
        (await request.json()) as
          CreateMatchInput;

      const matches =
        readMatches();

      const duplicate =
        matches.find(
          (match) =>
            match.endedAt ===
            body.endedAt,
        );

      if (duplicate) {
        return HttpResponse.json(
          duplicate,
        );
      }

      const match:
        MatchRecord = {
        id:
          crypto.randomUUID(),

        ...body,
      };

      const updated = [
        match,
        ...matches,
      ];

      saveMatches(updated);

      return HttpResponse.json(
        match,

        {
          status: 201,
        },
      );
    },
  ),
];