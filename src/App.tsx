import { useCallback, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  GameCanvas,
  type GameResult,
  type TouchControlsState,
} from "./components/GameCanvas";

import { TouchControls } from "./components/TouchControls";

import { MainMenu } from "./pages/MainMenu";
import { Result } from "./pages/Result";
import { Option } from "./pages/Option";
import { Ranking } from "./pages/Ranking";
import { MatchHistory } from "./pages/MatchHistory";

import { createMatch } from "./api/matchApi";

type Screen = "menu" | "game" | "options" | "result" | "ranking" | "history";

const EMPTY_TOUCH_CONTROLS: TouchControlsState = {
  forward: false,
  backward: false,

  turnLeft: false,
  turnRight: false,

  fireFront: false,
  fireLeft: false,
  fireRight: false,

  pause: false,
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("menu");

  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const [touchControls, setTouchControls] =
    useState<TouchControlsState>(EMPTY_TOUCH_CONTROLS);

  const queryClient = useQueryClient();

  const saveMatchMutation = useMutation({
    mutationFn: createMatch,

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["matches"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["ranking"],
      });
    },
  });

  const handleStartGame = useCallback(() => {
    setGameResult(null);

    setTouchControls(EMPTY_TOUCH_CONTROLS);

    setScreen("game");
  }, []);

  const handleExitToMenu = useCallback(() => {
    setTouchControls(EMPTY_TOUCH_CONTROLS);

    setScreen("menu");
  }, []);

  const handleGameEnd = useCallback(
    (result: GameResult) => {
      setGameResult(result);

      setTouchControls(EMPTY_TOUCH_CONTROLS);

      saveMatchMutation.mutate({
        playerName: "Captain",

        score: result.score,

        reason: result.reason,

        duration: result.duration,

        remainingTime: result.remainingTime,

        endedAt: result.endedAt,
      });

      setScreen("result");
    },
    [saveMatchMutation],
  );

  if (screen === "menu") {
    return (
      <MainMenu
        onPlay={handleStartGame}
        onOptions={() => setScreen("options")}
        onRanking={() => setScreen("ranking")}
        onHistory={() => setScreen("history")}
      />
    );
  }

  if (screen === "game") {
    return (
      <main
        style={{
          position: "relative",

          width: "100vw",

          minHeight: "100vh",

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          overflow: "hidden",

          background: "#020617",
        }}
      >
        <GameCanvas
          onGameEnd={handleGameEnd}
          onExitToMenu={handleExitToMenu}
          touchControls={touchControls}
        />

        <TouchControls onChange={setTouchControls} />
      </main>
    );
  }

  if (screen === "result" && gameResult) {
    return (
      <Result
        result={gameResult}
        onPlayAgain={handleStartGame}
        onBackToMenu={handleExitToMenu}
      />
    );
  }

  if (screen === "options") {
    return <Option onBack={handleExitToMenu} />;
  }

  if (screen === "ranking") {
    return <Ranking onBack={handleExitToMenu} />;
  }

  if (screen === "history") {
    return <MatchHistory onBack={handleExitToMenu} />;
  }

  return null;
}
