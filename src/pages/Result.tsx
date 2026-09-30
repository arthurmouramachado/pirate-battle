import type { GameResult } from "../components/GameCanvas";

interface ResultProps {
  result: GameResult;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export function Result({ result, onPlayAgain, onBackToMenu }: ResultProps) {
  const resultTitle = result.reason === "time" ? "Time Up!" : "Ship Destroyed!";

  const resultDescription =
    result.reason === "time"
      ? "The battle has ended."
      : "Your ship was destroyed.";

  return (
    <main style={styles.container}>
      <section style={styles.card}>
        <p style={styles.label}>Battle Result</p>

        <h1 style={styles.title}>{resultTitle}</h1>

        <p style={styles.description}>{resultDescription}</p>

        <div style={styles.scoreContainer}>
          <span style={styles.scoreLabel}>Final Score</span>

          <strong style={styles.score}>{result.score}</strong>
        </div>

        <div style={styles.information}>
          <div style={styles.informationItem}>
            <span>Match Duration</span>

            <strong>{formatTime(result.duration)}</strong>
          </div>

          <div style={styles.informationItem}>
            <span>Remaining Time</span>

            <strong>{formatTime(result.remainingTime)}</strong>
          </div>
        </div>

        <div style={styles.actions}>
          <button
            style={{
              ...styles.button,
              ...styles.primaryButton,
            }}
            onClick={onPlayAgain}
          >
            Play Again
          </button>

          <button style={styles.button} onClick={onBackToMenu}>
            Main Menu
          </button>
        </div>
      </section>
    </main>
  );
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "100vw",
    minHeight: "100vh",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    background:
      "linear-gradient(180deg, #082f49 0%, #0c4a6e 50%, #075985 100%)",

    fontFamily: "Arial, Helvetica, sans-serif",

    color: "#ffffff",
  },

  card: {
    width: "min(90%, 500px)",

    padding: "40px",

    borderRadius: "20px",

    background: "rgba(15, 23, 42, 0.92)",

    border: "1px solid rgba(255,255,255,0.15)",

    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",

    textAlign: "center",
  },

  label: {
    margin: 0,

    color: "#94a3b8",

    textTransform: "uppercase",

    fontSize: "13px",

    fontWeight: 700,

    letterSpacing: "2px",
  },

  title: {
    margin: "12px 0 8px",

    fontSize: "44px",

    color: "#facc15",
  },

  description: {
    margin: "0 0 30px",

    color: "#cbd5e1",
  },

  scoreContainer: {
    padding: "24px",

    marginBottom: "24px",

    borderRadius: "16px",

    background: "rgba(2, 132, 199, 0.18)",

    border: "1px solid rgba(56,189,248,0.25)",

    display: "flex",

    flexDirection: "column",

    gap: "6px",
  },

  scoreLabel: {
    color: "#bae6fd",

    fontSize: "15px",
  },

  score: {
    fontSize: "54px",

    color: "#ffffff",
  },

  information: {
    display: "flex",

    flexDirection: "column",

    gap: "10px",

    marginBottom: "28px",
  },

  informationItem: {
    padding: "12px 14px",

    borderRadius: "8px",

    display: "flex",

    justifyContent: "space-between",

    background: "rgba(255,255,255,0.06)",

    color: "#cbd5e1",
  },

  actions: {
    display: "flex",

    flexDirection: "column",

    gap: "12px",
  },

  button: {
    padding: "14px 20px",

    border: "none",

    borderRadius: "10px",

    background: "#1e293b",

    color: "#ffffff",

    cursor: "pointer",

    fontSize: "17px",

    fontWeight: 700,
  },

  primaryButton: {
    background: "#f59e0b",

    color: "#1c1917",
  },
};
