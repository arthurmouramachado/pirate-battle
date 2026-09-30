import { api } from "./api";

import type { RankingEntry } from "../game/types";

export async function getRanking() {
  const response =
    await api.get<
      RankingEntry[]
    >("/ranking");

  return response.data;
}