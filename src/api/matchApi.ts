import { api } from "./api";

import type {
  CreateMatchInput,
  MatchRecord,
} from "../game/types";

export async function getMatches() {
  const response =
    await api.get<
      MatchRecord[]
    >("/matches");

  return response.data;
}

export async function createMatch(
  match: CreateMatchInput,
) {
  const response =
    await api.post<MatchRecord>(
      "/matches",
      match,
    );

  return response.data;
}